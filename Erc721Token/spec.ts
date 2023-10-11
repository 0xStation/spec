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
 * An ERC721 Token on Station.
 */
@Spec({
  uniqueBy: ["tokenContractAddress", "tokenId", "chainId"],
})
class Erc721Token extends LiveObject {
  // The 721 contract.
  @Property()
  tokenContractAddress: Address;

  // The 721 token id.
  @Property()
  tokenId: BigInt;

  // The current NFT owner.
  @Property()
  ownerAddress: Address;

  // ==== Event Handlers ===================
  @OnEvent("station.ERC721.Transfer")
  onTransfer(event: Event) {
    this.tokenContractAddress = event.origin.contractAddress;
    this.tokenId = BigInt.from(event.data.tokenId);
    this.ownerAddress = event.data.to;
  }
}

export default Erc721Token;
