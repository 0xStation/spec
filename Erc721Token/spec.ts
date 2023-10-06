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
  uniqueBy: ["contractAddress", "tokenId", "chainId"],
})
class Erc721Token extends LiveObject {
  // The membership contract.
  @Property()
  contractAddress: Address;

  // The NFT token id.
  @Property()
  tokenId: BigInt;

  // The current NFT owner.
  @Property()
  ownerAddress: Address;

  // ==== Event Handlers ===================

  @OnEvent("station.Erc721Token.Transfer")
  async onTransfer(event: Event) {
    this.contractAddress = event.origin.contractAddress;
    this.tokenId = BigInt.from(event.data.tokenId);
    this.ownerAddress = event.data.to;
  }

  @OnEvent("station.MembershipFactory.MembershipCreated")
  onMembershipCreated(event: Event) {
    this.addContractToGroup(event.data.membership, "station.Erc721Token");
  }
}

export default Erc721Token;
