import {
  LiveTable,
  Spec,
  Property,
  Event,
  OnEvent,
  Address,
  BigInt,
  Timestamp,
  isNullAddress,
  ERC6551Registry,
} from "@spec.dev/core";
import * from "./constants.ts"

/**
 * An ERC721 Token on Station.
 */
@Spec({
  uniqueBy: ["tokenContractAddress", "tokenId", "chainId"],
})
class Erc721Token extends LiveTable {
  // The 721 contract.
  @Property()
  tokenContractAddress: Address;

  // The 721 token id.
  @Property()
  tokenId: BigInt;

  // The current NFT owner.
  @Property()
  ownerAddress: Address;

  @Property()
  mintedAt: Timestamp;

  @Property()
  stationTbaAddress: Address;

  // ==== Event Handlers ===================
  @OnEvent("station.ERC721.Transfer")
  onTransfer(event: Event) {
    this.tokenContractAddress = event.origin.contractAddress;
    this.tokenId = BigInt.from(event.data.tokenId);
    this.ownerAddress = event.data.to;

    // Mark joinedAt and resolve TBA address from ERC6551Registry only on mints.
    if (isNullAddress(event.data.from)) {
      this.mintedAt = this.blockTimestamp
      await this._resolveTbaAddress()
    }
  }

  async _resolveTbaAddress() {
    const registryContract = new ERC6551Registry(this.chainId, ERC6551_REGISTRY)
    this.stationTbaAddress = await registryContract.account(
      ERC6551_ACCOUNT_PROXY,
      STATION_ACCOUNT_SALT,
      this.chainId,
      this.contractAddress,
      this.tokenId
    )
  }
}

export default Erc721Token;
