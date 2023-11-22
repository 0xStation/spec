import {
  LiveTable,
  Spec,
  Property,
  Event,
  OnEvent,
  Address,
} from "@spec.dev/core"

/**
 * A TokenOperator on Station.
 */
@Spec({
  uniqueBy: ["contractAddress", "operatorAddress", "chainId"],
})
class TokenOperator extends LiveTable {
  // The membership contract.
  @Property()
  contractAddress: Address

  // The token operator address.
  @Property()
  operatorAddress: Address

  // The permissions of the token operator.
  @Property()
  permissions: string

  // ==== Event Handlers ===================

  @OnEvent("station.Membership.Permit")
  onPermit(event: Event) {
    this.contractAddress = event.origin.contractAddress
    this.operatorAddress = event.data.account
    this.permissions = event.data.permissions
  }
}

export default TokenOperator
