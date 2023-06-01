import { LiveObject, Spec, Property, Timestamp, Address, ChainId, BlockHash, BlockNumber, OnEvent, Event, EventOrigin, saveAll, mapByKey, ZERO_ADDRESS, BigInt } from '@spec.dev/core'
import Split from '../Split/spec.ts'
import SplitRecipient from '../SplitRecipient/spec.ts'
import SplitRecipientWithdrawalEvent from '../SplitRecipientWithdrawalEvent/spec.ts'

/**
 * The Station representation of a token owned by a 0xSplits recipient.
*/
@Spec({ uniqueBy: ['splitAddress', 'recipientAddress', 'tokenAddress', 'chainId'] })
class SplitRecipientToken extends LiveObject {
    // The contract address of the Split.
    @Property()
    splitAddress: Address

    // The address of the recipient.
    @Property()
    recipientAddress: Address

    // The address of the token (zero address for ETH).
    @Property()
    tokenAddress: Address

    // Amount of this token distributed to this recipient.
    @Property()
    totalDistributed: BigInt

    // Amount of this token claimed by this recipient.
    @Property()
    totalClaimed: BigInt

    // The block hash in which the SplitRecipientToken was last updated.
    @Property()
    blockHash: BlockHash

    // The block number in which the SplitRecipientToken was last updated.
    @Property()
    blockNumber: BlockNumber

    // The block timestamp in which the SplitRecipientToken was last updated.
    @Property({ primaryTimestamp: true })
    blockTimestamp: Timestamp

    // The blockchain id.
    @Property()
    chainId: ChainId

    //-----------------------------------------------------
    //  EVENT HANDLERS
    //-----------------------------------------------------

    @OnEvent('contracts.0xsplits.SplitMain.DistributeETH', { canReplay: false })
    async distributeETH(event: Event) {
        await this._handleTokenDistribution(
            event.data.split,
            BigInt.from(event.data.amount || 0),
            ZERO_ADDRESS,
            event.origin,
        )
    }

    @OnEvent('contracts.0xsplits.SplitMain.DistributeERC20', { canReplay: false })
    async distributeERC20(event: Event) {
        await this._handleTokenDistribution(
            event.data.split,
            BigInt.from(event.data.amount || 0),
            event.data.token,
            event.origin,
        )
    }

    @OnEvent('contracts.0xsplits.SplitMain.Withdrawal', { canReplay: false })
    async withdrawRecipientTokens(event: Event) {
        const { chainId, blockHash, blockNumber, blockTimestamp } = event.origin
        const recipientAddress = event.data.account
        const withdrawnTokenAddresses = event.data.tokens || []

        // Auto-add ETH as a token being withdrawn.
        const withDrawnAmount = BigInt.from(event.data.ethAmount)
        withDrawnAmount.gtZero() && withdrawnTokenAddresses.push(ZERO_ADDRESS)

        // Get all tokens being withdrawn by this recipient 
        // across *all* of this recipient's splits.
        const withdrawnTokens = await this.find(SplitRecipientToken, { 
            recipientAddress, 
            tokenAddress: withdrawnTokenAddresses,
            chainId,
        })

        // Update the totalClaimed for each token.
        const liveObjectsToSave = []
        for (const token of withdrawnTokens) {
            const lastDistributed = token.totalDistributed
            const lastClaimed = token.totalClaimed
            const valueWithdrawn = lastDistributed.minus(lastClaimed)
            if (valueWithdrawn.isZero()) continue

            token.totalClaimed = lastDistributed

            // Create a new withdrawal event to persist.
            const withdrawalEvent = this.new(SplitRecipientWithdrawalEvent, {
                splitAddress: token.splitAddress,
                recipientAddress: token.recipientAddress,
                tokenAddress: token.tokenAddress,
                transactionHash: event.data.transactionHash,
                logIndex: event.data.logIndex,
                valueWithdrawn,
                blockHash,
                blockNumber,
                blockTimestamp,
                chainId,
            })

            liveObjectsToSave.push(...[token, withdrawalEvent])
        }
        // Save all token updates and withdrawal events.
        liveObjectsToSave.length && await saveAll(...liveObjectsToSave)
    }

    //-----------------------------------------------------
    //  HELPERS
    //-----------------------------------------------------

    async _handleTokenDistribution(
        splitAddress: Address,
        splitAmount: BigInt,
        tokenAddress: Address,
        eventOrigin: EventOrigin,
    ) {
        const { blockHash, blockTimestamp, blockNumber, chainId } = eventOrigin

        // Get the Split and its recipients.
        const [split, recipients] = await Promise.all([
            this.findOne(Split, { address: splitAddress, chainId }),
            this.find(SplitRecipient, { splitAddress, chainId }),
        ])
        if (!split) {
            console.error(`Split not found (splitAddress=${splitAddress}, chainId=${chainId})`)
            return
        }

        // Get this specific token for each recipient in the Split (may not exist yet).
        const recipientTokensMap = mapByKey(await this.find(SplitRecipientToken, {
            splitAddress,
            recipientAddress: recipients.map(r => r.recipientAddress),
            tokenAddress,
            chainId,
        }), 'recipientAddress')

        // Calculate the amount to split after the distributor fee is applied.
        const distributorFeeAmount = this._scaleAmountByPercentage(splitAmount, split.distributorFee)
        splitAmount = splitAmount.minus(distributorFeeAmount)

        // Upsert the token for each recipient and calculate the new totalDistributed for each.
        const tokens = recipients.map(recipient => {
            const token = recipientTokensMap[recipient.recipientAddress] || this.new(SplitRecipientToken, {
                splitAddress,
                recipientAddress: recipient.recipientAddress,
                tokenAddress,
                totalDistributed: BigInt.from(0),
                totalClaimed: BigInt.from(0),
                blockHash,
                blockNumber,
                blockTimestamp,
                chainId,
            })
            token.totalDistributed = token.totalDistributed.plus(
                this._scaleAmountByPercentage(splitAmount, recipient.allocation)
            )
            return token
        })

        // Save all in a single transaction.
        await saveAll(...tokens)
    }

    _scaleAmountByPercentage(amount: BigInt, percentage: BigInt): BigInt {
        return amount.times(percentage).div(1000000)
    }
}

export default SplitRecipientToken