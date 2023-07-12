import {
  LiveObject,
  Spec,
  Property,
  Event,
  OnEvent,
  Address,
  String,
} from "@spec.dev/core";

/**
 * A TokenOperator on Station.
 */
@Spec({
  uniqueBy: ["contractAddress", "operatorAddress", "chainId"],
})
class TokenOperator extends LiveObject {
  // The membership contract.
  @Property()
  contractAddress: Address

  // The token operator address.
  @Property()
  operatorAddress: Address

  // The permissions of the token operator.
  @Property()
  permissions: String

  // ==== Event Handlers ===================

  @OnEvent("station.Membership.Permit")
  onTransfer(event: Event) {
    this.contractAddress = event.origin.contractAddress;
    this.operatorAddress = event.data.account;
    this.permissions = event.data.permissions;
  }
}

export default TokenOperator;
