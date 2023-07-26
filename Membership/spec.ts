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
  ERC6551Registry,
} from "@spec.dev/core"
import { REGISTRY_IMPLEMENTATION } from "./constants.ts"

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
  async onTransfer(event: Event) {
    this.contractAddress = event.origin.contractAddress
    this.tokenId = BigInt.from(event.data.tokenId)
    this.ownerAddress = event.data.to

    // Mark joinedAt and resolve TBA address from ERC6551Registry only on mints.
    if (event.data.from === ZERO_ADDRESS) {
      this.joinedAt = this.blockTimestamp
      await this._resolveTbaAddress()
    }
  }

  @OnEvent("station.MembershipFactory.MembershipCreated")
  onMembershipCreated(event: Event) {
    this.addContractToGroup(event.data.membership, "station.Membership")
  }

  // ==== HELPERS ==========================

  async _resolveTbaAddress() {
    this.tbaAddress = await new ERC6551Registry(this.chainId).account(
      REGISTRY_IMPLEMENTATION,
      this.chainId,
      this.contractAddress,
      this.tokenId,
      0
    )
  }
}

export default Membership
