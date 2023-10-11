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

  // MembershipFactory?
  @OnEvent("station.TokenFactory.ERC20Created")
  onErc20Created(event: Event) {
    this.addContractToGroup(event.data.token, "station.ERC20");
  }

  // MembershipFactory?
  @OnEvent("station.TokenFactory.ERC721Created")
  onErc721Created(event: Event) {
    this.addContractToGroup(event.data.token, "station.ERC721");
  }

  // MembershipFactory?
  @OnEvent("station.TokenFactory.ERC1155Created")
  onErc1155Created(event: Event) {
    this.addContractToGroup(event.data.token, "station.ERC1155");
  }
}

export default TokenContract;
