import { LiveObject, Spec, Property, Timestamp, Address, ChainId, BlockHash, BlockNumber, TransactionHash, BigInt } from '@spec.dev/core'

/**
 * The Station representation of a withdrawal event on 0xSplits.
 */
@Spec({ uniqueBy: ['recipientAddress', 'transactionHash', 'logIndex', 'chainId'] })
class SplitRecipientWithdrawalEvent extends LiveObject {
    // The address of the Split contract.
    @Property()
    splitAddress: Address

    // The address of the recipient making the withdrawal.
    @Property()
    recipientAddress: Address

    // The address of the token being withdrawn.
    @Property()
    tokenAddress: Address

    // The token value withdrawn.
    @Property()
    valueWithdrawn: BigInt
    
    // The transaction in which the withdrawal occurred.
    @Property()
    transactionHash: TransactionHash

    // The log index of the transaction in which the withdrawal occurred.
    @Property()
    logIndex: number

    // The block hash in which the withdrawal occurred.
    @Property()
    blockHash: BlockHash

    // The block number in which the withdrawal occurred.
    @Property()
    blockNumber: BlockNumber

    // The block timestamp in which the withdrawal occurred.
    @Property({ primaryTimestamp: true })
    blockTimestamp: Timestamp

    // The blockchain id.
    @Property()
    chainId: ChainId
}

export default SplitRecipientWithdrawalEvent