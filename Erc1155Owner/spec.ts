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
 * An ERC1155 owner on Station.
 */
@Spec({
  uniqueBy: ["tokenContractAddress", "tokenId", "chainId", "ownerAddress"],
})
class Erc1155Owner extends LiveObject {
  // The 1155 contract.
  @Property()
  tokenContractAddress: Address;

  // The 1155 token id.
  @Property()
  tokenId: BigInt;

  // One of possibly many owners of the 1155.
  @Property()
  ownerAddress: Address;

  // ==== Event Handlers ===================

  @OnEvent("station.ERC1155.Transfer")
  onTransfer(event: Event) {
    this.tokenContractAddress = event.origin.contractAddress;
    this.tokenId = BigInt.from(event.data.tokenId);
    this.ownerAddress = event.data.to;
  }
}

export default Erc1155Owner;
