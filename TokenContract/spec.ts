import {
  LiveTable,
  Spec,
  Property,
  Event,
  OnEvent,
  Address,
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

  @OnEvent("station.TokenFactory.ERC20Created")
  onErc20Created(event: Event) {
    this.contractAddress = event.data.token;
    this.tokenStandard = "ERC20";
    this.addContractToGroup(this.contractAddress, "station.ERC20");
  }

  @OnEvent("station.TokenFactory.ERC721Created")
  onErc721Created(event: Event) {
    this.contractAddress = event.data.token;
    this.tokenStandard = "ERC721";
    this.addContractToGroup(this.contractAddress, "station.ERC721");
  }

  @OnEvent("station.TokenFactory.ERC1155Created")
  onErc1155Created(event: Event) {
    this.contractAddress = event.data.token;
    this.tokenStandard = "ERC1155";
    this.addContractToGroup(this.contractAddress, "station.ERC1155");
  }

  @OnEvent("station.ERC20.NameUpdated")
  @OnEvent("station.ERC721.NameUpdated")
  @OnEvent("station.ERC1155.NameUpdated")
  onNameUpdated(event: Event) {
    this.contractAddress = event.origin.contractAddress;
    this.name = event.data.name;
  }
  
  @OnEvent("station.ERC20.SymbolUpdated")
  @OnEvent("station.ERC721.SymbolUpdated")
  @OnEvent("station.ERC1155.SymbolUpdated")
  onSymbolUpdated(event: Event) {
    this.contractAddress = event.origin.contractAddress;
    this.symbol = event.data.symbol;
  }
}

export default TokenContract;
