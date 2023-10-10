import {
  LiveObject,
  Spec,
  Property,
  Event,
  OnEvent,
  Address,
  BigInt,
} from "@spec.dev/core";

/**
 * An ERC1155 Token on Station.
 */
@Spec({
  uniqueBy: ["tokenContractAddress", "tokenId", "chainId"],
})
class Erc1155Token extends LiveObject {
  // The 1155 contract.
  @Property()
  tokenContractAddress: Address;

  // The 1155 token id.
  @Property()
  tokenId: BigInt;

  // ==== Event Handlers ===================

  @OnEvent("station.Erc1155Token.Transfer")
  onTransfer(event: Event) {
    this.tokenContractAddress = event.origin.contractAddress;
    this.tokenId = BigInt.from(event.data.tokenId);
  }
}

export default Erc1155Token;
