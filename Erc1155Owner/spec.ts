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
  @OnEvent("station.ERC1155.TransferSingle")
  async onTransferSingle(event: Event) {
    const tokenId = BigInt.from(event.data.id);
    const value = BigInt.from(event.data.value);

    const updatedBalances = (
      await this._registerTransfer(
        event.data.from,
        event.data.to,
        value,
        tokenId
      )
    ).filter((v) => !!v);

    await saveAll(...updatedBalances);
  }

  @OnEvent("station.ERC1155.TransferBatch")
  async onTransferBatch(event: Event) {
    const ids = event.data.ids;
    const values = event.data.values;

    const objectsToSave = [];
    for (let i = 0; i < ids.length; i++) {
      const id = BigInt.from(ids[i]);
      const value = BigInt.from(values[i]);

      const updatedBalances = (
        await this._registerTransfer(event.data.from, event.data.to, value, id)
      ).filter((v) => !!v);

      objectsToSave.push(...updatedBalances);
    }

    await saveAll(...objectsToSave);
  }

  async _registerTransfer(
    from: Address,
    to: Address,
    value: BigInt,
    tokenId: BigInt
  ): Promise<Erc1155Owner[] | null> {
    if (isNullAddress(to)) return null;

    const erc1155OwnerTo = this.new(Erc1155Owner, {
      tokenContractAddress: this.tokenContractAddress,
      ownerAddress: to,
      tokenId,
    });

    await erc1155OwnerTo.load();
    erc1155OwnerTo.balance = erc1155OwnerTo.balance.plus(value);

    const erc1155OwnerFrom = this.new(Erc1155Owner, {
      tokenContractAddress: this.tokenContractAddress,
      ownerAddress: from,
      tokenId,
    });

    await erc1155OwnerFrom.load();
    erc1155OwnerFrom.balance = erc1155OwnerFrom.balance.minus(value);

    return [erc1155OwnerTo, erc1155OwnerFrom];
  }
}

export default Erc1155Owner;
