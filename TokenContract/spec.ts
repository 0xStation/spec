import {
  LiveObject,
  Spec,
  Property,
  Event,
  OnEvent,
  Address,
  BeforeAll,
} from "@spec.dev/core";

/**
 * A Token contract on Station.
 * Responsible for creating new TokenContract records, as well as adding new contracts to the appropriate group.
 */
@Spec({
  uniqueBy: ["contractAddress", "chainId"],
})
class TokenContract extends LiveObject {
  // The contract address.
  @Property()
  contractAddress: Address;

  // The "type" of token contract.
  @Property()
  tokenStandard: string;

  // ==== Event Handlers ===================

  @BeforeAll()
  setCommonProperties(event: Event) {
    this.contractAddress = event.data.token;
  }

  @OnEvent("station.TokenFactory.ERC20Created")
  onErc20Created(event: Event) {
    this.tokenStandard = "ERC20";
    this.addContractToGroup(event.data.token, "station.ERC20");
  }

  @OnEvent("station.TokenFactory.ERC721Created")
  onErc721Created(event: Event) {
    this.tokenStandard = "ERC721";
    this.addContractToGroup(event.data.token, "station.ERC721");
  }

  @OnEvent("station.TokenFactory.ERC1155Created")
  onErc1155Created(event: Event) {
    this.tokenStandard = "ERC1155";
    this.addContractToGroup(event.data.token, "station.ERC1155");
  }
}

export default TokenContract;
