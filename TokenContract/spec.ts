import {
  LiveTable,
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
class TokenContract extends LiveTable {
  // The contract address.
  @Property()
  contractAddress: Address;

  // The ERC standard of token contract. One of "ERC20", "ERC721", or "ERC1155".
  @Property()
  tokenStandard: string;
  
  // The name of token contract.
  @Property()
  name: string;
  
  // The symbol of token contract.
  @Property()
  symbol: string;

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

  @OnEvent("station.ERC20.NameUpdated")
  @OnEvent("station.ERC721.NameUpdated")
  @OnEvent("station.ERC1155.NameUpdated")
  onNameUpdated(event: Event) {
    // how do I map `this` to the token contract that matches the (chainId, contractAddress) uniqueBy with the event.origin?
    this.name = event.data.name;
  }
  
  @OnEvent("station.ERC20.SymbolUpdated")
  @OnEvent("station.ERC721.SymbolUpdated")
  @OnEvent("station.ERC1155.SymbolUpdated")
  onSymbolUpdated(event: Event) {
    // how do I map `this` to the token contract that matches the (chainId, contractAddress) uniqueBy with the event.origin?
    this.symbol = event.data.symbol;
  }
  
}

export default TokenContract;
