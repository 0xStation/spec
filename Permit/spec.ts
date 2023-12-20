import {
  LiveTable,
  Spec,
  Property,
  Event,
  OnEvent,
  Address,
  BigInt,
} from "@spec.dev/core";

/**
 * An token Permit on Station.
 */
@Spec({
  uniqueBy: ["chainId", "moduleAddress", "signerAddress", "nonce"],
})
class Permit extends LiveTable {
  @Property()
  signerAddress: Address;

  @Property()
  moduleAddress: Address;

  @Property()
  nonce: BigInt;

  @Property()
  used: boolean;

  // ==== Event Handlers ===================

  @OnEvent("station.GeneralFreeMintController.NonceUsed")
  onNonceUsed(event: Event) {
    this.moduleAddress = event.origin.contractAddress;
    this.signerAddress = event.data.account;
    this.nonce = BigInt.from(event.data.nonce);
    this.used = true;
  }
}

export default Permit;
