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
 * An ownership over ERC20s on Station.
 */
@Spec({
  uniqueBy: ["chainId", "contractAddress", "ownerAddress"],
})
class Erc20Owner extends LiveObject {
  // The membership contract.
  @Property()
  contractAddress: Address;

  // The account with a balance.
  @Property()
  ownerAddress: Address;

  // The balance of the owner.
  @Property()
  balance: BigInt;

  // ==== Event Handlers ===================
  @OnEvent("station.Erc20Owner.Transfer")
  async onTransfer(event: Event) {
    this.contractAddress = event.origin.contractAddress;
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
      contractAddress: this.contractAddress,
      ownerAddress,
    });

    // Load in existing property values if the record exists.
    const exists = await erc20Owner.load();
    if (!exists) {
      erc20Owner.balance = BigInt.from(0);
    }

    // Update balance.
    erc20Owner.balance = erc20Owner.balance.plus(value);
    return erc20Owner;
  }
}

export default Erc20Owner;