import {
  LiveObject,
  Spec,
  Property,
  Event,
  OnEvent,
  Address,
  BigInt,
  Timestamp,
  ZERO_ADDRESS,
} from "@spec.dev/core"

/**
 * A Membership NFT on Station.
 */
@Spec({
  uniqueBy: ["contractAddress", "tokenId", "chainId"],
})
class Membership extends LiveObject {
  // The membership contract.
  @Property()
  contractAddress: Address

  // The NFT token id.
  @Property()
  tokenId: BigInt

  // The current NFT owner.
  @Property()
  ownerAddress: Address

  // The token-bound account.
  @Property()
  tbaAddress: Address

  // When the membership was minted.
  @Property({ canUpdate: false })
  joinedAt: Timestamp

  // ==== Event Handlers ===================

  @OnEvent("station.Membership.Transfer")
  onTransfer(event: Event) {
    this.contractAddress = event.origin.contractAddress
    this.tokenId = BigInt.from(event.data.tokenId)
    this.ownerAddress = event.data.to
    this.tbaAddress = null // v2
    if (event.data.from === ZERO_ADDRESS) {
      // mint
      this.joinedAt = this.blockTimestamp
    }
  }

  @OnEvent("station.MembershipFactory.MembershipCreated")
  onMembershipCreated(event: Event) {
    this.addContractToGroup(event.data.membership, "station.Membership")
  }
}

export default Membership
