import {
  LiveObject,
  Spec,
  Property,
  Event,
  OnEvent,
  Address,
} from "@spec.dev/core";

/**
 * A Token contract on Station.
 */
@Spec({
  uniqueBy: ["contractAddress", "chainId"],
})
class TokenContract extends LiveObject {
  // The contract address.
  @Property()
  contractAddress: Address;

  // ==== Event Handlers ===================

  @OnEvent("station.Membership.Transfer")
  onTransfer(event: Event) {
    this.contractAddress = event.origin.contractAddress;
  }

  @OnEvent("station.MembershipFactory.MembershipCreated")
  onMembershipCreated(event: Event) {
    this.addContractToGroup(event.data.membership, "station.Membership");
  }
}

export default TokenContract;
