import {
  LiveObject,
  Spec,
  Property,
  Event,
  OnEvent,
  Address,
  BigInt,
  Timestamp,
  isNullAddress,
} from "@spec.dev/core"

/**
 * A Points balance on Station.
 */
@Spec({
  uniqueBy: ["chainId", "contractAddress", "accountAddress"]
})
class PointsBalance extends LiveObject {
  // The membership contract.
  @Property()
  contractAddress: Address

  // The account with a balance.
  @Property()
  ownerAddress: Address
  
  // The balance of the owner.
  @Property()
  balance: BigInt

  // ==== Event Handlers ===================

  @OnEvent("station.Points.Transfer")
  async onTransfer(event: Event) {
    this.contractAddress = event.origin.contractAddress
    this.ownerAddress = event.data.to

    if (!isNullAddress(event.data.to)) {
      this.balance += BigInt.from(event.data.amount)
    }

    // Mark firstMintAt and
    if (!isNullAddress(event.data.from)) {
      /// @todo how do I decrease the balance of the record matching `event.data.from`?
    }
  } 
}

export default PointsBalance
