import {
  LiveObject,
  Spec,
  Property,
  Event,
  OnEvent,
  Address,
  BigInt,
  saveAll,
} from "@spec.dev/core";

/**
 * An token Permit on Station.
 */
@Spec({
  uniqueBy: ["chainId", "moduleAddress", "signerAddress", "nonce"],
})
class Permit extends LiveObject {
  @Property()
  signerAddress: Address;

  @Property()
  nonce: BigInt;

  // ==== Event Handlers ===================
  @OnEvent("station.Modules.NonceUsed", { autoSave: false })
  async onNonceUsed(event: Event) {
    const existingPermit = this.new(Permit, {
      moduleAddress: event.origin.contractAddress,
      signerAddress: event.data.account,
      nonce: event.data.nonce,
    });

    await existingPermit.load();
    existingPermit.used = true;

    await saveAll(existingPermit);
  }
}

export default Permit;
