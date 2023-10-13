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
  // empty -- should just upsert
  // todo: maybe check if it's a transfer from 0 address?
  // if so, save, otherwise ignore? Is that possible in Spec?
  @OnEvent("station.ERC1155.Transfer")
  onTransfer(event: Event) {
    this.tokenContractAddress = event.origin.contractAddress;
    this.tokenId = BigInt.from(event.data.tokenId);
  }
}

export default Erc1155Token;
