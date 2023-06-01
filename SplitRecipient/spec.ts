import { LiveObject, Spec, Property, Timestamp, Address, ChainId, BlockHash, BlockNumber, BigInt } from '@spec.dev/core'

/**
 * The Station representation of a 0xSplits recipient.
 */
@Spec({ uniqueBy: ['splitAddress', 'recipientAddress', 'chainId'] })
class SplitRecipient extends LiveObject {
    // The address of the Split contract.
    @Property()
    splitAddress: Address

    // The address of the recipient.
    @Property()
    recipientAddress: Address

    // The recipient's allocation of the Split.
    @Property()
    allocation: BigInt

    // The block hash in which the SplitRecipient was created.
    @Property()
    blockHash: BlockHash

    // The block number in which the SplitRecipient was created.
    @Property()
    blockNumber: BlockNumber

    // The block timestamp in which the SplitRecipient was created.
    @Property({ primaryTimestamp: true })
    blockTimestamp: Timestamp

    // The blockchain id.
    @Property()
    chainId: ChainId
}

export default SplitRecipient