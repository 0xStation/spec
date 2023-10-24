import {
  LiveObject,
  Spec,
  Property,
  Event,
  OnEvent,
  Address,
  BigInt,
  save,
} from "@spec.dev/core";

/**
 * An token Permit on Station.
 */
@Spec({
  uniqueBy: ["chainId", "signerAddress", "nonce"],
})
class Permit extends LiveObject {
  @Property()
  signerAddress: Address;

  @Property()
  nonce: BigInt;

  // ==== Event Handlers ===================
  @OnEvent("station.ERC1155.NonceUsed", { autoSave: false })
  async onNonceUsed(event: Event) {
    const existingPermit = this.new(Permit, {
      signerAddress: event.data.account,
      nonce: event.data.nonce,
    });

    await existingPermit.load();
    existingPermit.used = true;

    await save(existingPermit);
  }
}

export default Permit;
