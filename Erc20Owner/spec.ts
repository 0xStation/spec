import {
  LiveTable,
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
 * An ownership over ERC20s on Station.
 */
@Spec({
  uniqueBy: ["chainId", "tokenContractAddress", "ownerAddress"],
})
class Erc20Owner extends LiveTable {
  // The erc20 contract.
  @Property()
  tokenContractAddress: Address;

  // The account with a balance.
  @Property()
  ownerAddress: Address;

  // The balance of the owner.
  @Property()
  balance: BigInt;

  // ==== Event Handlers ===================
  @OnEvent("station.ERC20.Transfer", { autoSave: false })
  async onTransfer(event: Event) {
    this.tokenContractAddress = event.origin.contractAddress;
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
  ): Promise<Erc20Owner | null> {
    if (isNullAddress(ownerAddress)) return null;

    // Instantiate new class instance to reference.
    const erc20Owner = this.new(Erc20Owner, {
      tokenContractAddress: this.tokenContractAddress,
      ownerAddress,
    });

    // Load in existing property values if the record exists.
    await erc20Owner.load();

    // Update balance.
    erc20Owner.balance = erc20Owner.balance.plus(value);
    return erc20Owner;
  }
}

export default Erc20Owner;
