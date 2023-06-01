import { LiveObject, Spec, Property, Timestamp, Address, ChainId, BlockHash, BlockNumber, saveAll, BigInt, OnCall, Call } from '@spec.dev/core'
import SplitRecipient from '../SplitRecipient/spec.ts'

/**
 * The Station representation of a Split contract on the 0xSplits protocol.
 */
@Spec({ uniqueBy: ['address', 'chainId'] })
class Split extends LiveObject {
    // The address of the Split contract.
    @Property()
    address: Address

    // The fee paid by the Split to cover gas distribution costs.
    @Property()
    distributorFee: BigInt

    // The block hash in which the Split was created.
    @Property()
    blockHash: BlockHash

    // The block number in which the Split was created.
    @Property()
    blockNumber: BlockNumber

    // The block timestamp in which the Split was created.
    @Property({ primaryTimestamp: true })
    blockTimestamp: Timestamp

    // The blockchain id.
    @Property()
    chainId: ChainId

    //-----------------------------------------------------
    //  FUNCTION CALL HANDLERS
    //-----------------------------------------------------  

    @OnCall('0xsplits.SplitMain.createSplit')
    async onCreateSplit(call: Call) {
        // New Split.
        this.address = call.outputs.split
        this.distributorFee = BigInt.from(call.inputs.distributorFee)
        this.blockHash = call.origin.blockHash
        this.blockNumber = call.origin.blockNumber
        this.blockTimestamp = call.origin.blockTimestamp
        this.chainId = call.origin.chainId

        // New SpiltRecipients.
        const accounts = call.inputs.accounts || []
        const recipients = accounts.map((address, i) => this.new(SplitRecipient, {
            splitAddress: this.address,
            recipientAddress: address,
            allocation: BigInt.from(call.inputs.percentAllocations[i] || 0),
            blockHash: this.blockHash,
            blockNumber: this.blockNumber,
            blockTimestamp: this.blockTimestamp,
            chainId: this.chainId,
        }))

        // Save Split + receipients in a single transaction.
        await saveAll(this, ...recipients) 
    }
}

export default Split