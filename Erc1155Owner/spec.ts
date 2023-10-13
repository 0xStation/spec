import {
  LiveObject,
  Spec,
  Property,
  Event,
  OnEvent,
  Address,
  BigInt,
  isNullAddress,
  saveAll,
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
  async onTransfer(event: Event) {
    this.tokenContractAddress = event.origin.contractAddress;
    this.tokenId = BigInt.from(event.data.tokenId);

    const value = BigInt.from(event.data.value);

    const updatedBalances = (
      await Promise.all([
        this._applyAmountToBalance(event.data.to, value),
        this._applyAmountToBalance(event.data.from, value.times(-1)),
      ])
    ).filter((v) => !!v);

    await saveAll(...updatedBalances);
  }

  async _applyAmountToBalance(
    ownerAddress: Address,
    value: BigInt
  ): Promise<Erc1155Owner | null> {
    if (isNullAddress(ownerAddress)) return null;

    // Instantiate new class instance to reference.
    const erc1155Owner = this.new(Erc1155Owner, {
      tokenContractAddress: this.tokenContractAddress,
      ownerAddress,
    });

    // Load in existing property values if the record exists.
    await erc1155Owner.load();

    // Update balance.
    erc1155Owner.balance = erc1155Owner.balance.plus(value);
    return erc1155Owner;
  }
}

export default Erc1155Owner;
