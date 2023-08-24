import {
  LiveObject,
  Spec,
  Property,
  Event,
  OnEvent,
  Address,
  BigInt,
  isNullAddress,
  saveAll,
} from "@spec.dev/core"

/**
 * A Points balance on Station.
 */
@Spec({
  uniqueBy: ["chainId", "contractAddress", "ownerAddress"]
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
    const value = BigInt.from(event.data.value)

    const updatedBalances = (await Promise.all([
      this._applyAmountToBalance(event.data.to, value),
      this._applyAmountToBalance(event.data.from, value.times(-1)),
    ])).filter(v => !!v)

    await saveAll(...updatedBalances)
  } 

  async _applyAmountToBalance(
    ownerAddress: Address, 
    value: BigInt,
  ): Promise<PointsBalance | null> {
    if (isNullAddress(ownerAddress)) return null

    // Instantiate new class instance to reference.
    const pointsBalance = this.new(PointsBalance, {
      chainId: this.chainId,
      contractAddress: this.contractAddress,
      ownerAddress,
    })
    
    // Load in existing property values if the record exists.
    const exists = await pointsBalance.load()
    if (!exists) {
      pointsBalance.balance = BigInt.from(0)
    }

    // Update balance.
    pointsBalance.balance = pointsBalance.balance.plus(value)
    return pointsBalance
  }
}

export default PointsBalance
