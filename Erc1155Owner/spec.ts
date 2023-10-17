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
  BeforeAll,
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

  // How many erc1155 for a given tokenId this owner has.
  @Property()
  balance: BigInt;

  @BeforeAll()
  setCommonProperties(event: Event) {
    this.tokenContractAddress = event.origin.contractAddress;
  }

  // ==== Event Handlers ===================
  @OnEvent("station.ERC1155.TransferSingle", { autoSave: false })
  async onTransferSingle(event: Event) {
    const tokenId = BigInt.from(event.data.id);
    const value = BigInt.from(event.data.value);

    const updatedBalances = (
      await Promise.all([
        this._applyAmountToBalance(event.data.to, tokenId, value),
        this._applyAmountToBalance(event.data.from, tokenId, value.times(-1)),
      ])
    ).filter((v) => !!v);

    await saveAll(...updatedBalances);
  }

  @OnEvent("station.ERC1155.TransferBatch", { autoSave: false })
  async onTransferBatch(event: Event) {
    const ids = event.data.ids;
    const values = event.data.values;

    const objectsToSave = [];
    for (let i = 0; i < ids.length; i++) {
      const id = BigInt.from(ids[i]);
      const value = BigInt.from(values[i]);

      const updatedBalances = (
        await Promise.all([
          this._applyAmountToBalance(event.data.to, id, value),
          this._applyAmountToBalance(event.data.from, id, value.times(-1)),
        ])
      ).filter((v) => !!v);

      objectsToSave.push(...updatedBalances);
    }

    await saveAll(...objectsToSave);
  }

  async _applyAmountToBalance(
    ownerAddress: Address,
    tokenId: BigInt,
    value: BigInt,
  ): Promise<Erc1155Owner | null> {
    if (isNullAddress(ownerAddress)) return null;

    const erc1155Owner = this.new(Erc1155Owner, {
      tokenContractAddress: this.tokenContractAddress,
      ownerAddress,
      tokenId,
    });

    await erc1155Owner.load();
    erc1155Owner.balance = erc1155Owner.balance.plus(value);

    return erc1155Owner;
  }
}

export default Erc1155Owner;