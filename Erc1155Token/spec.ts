import {
  LiveTable,
  Spec,
  Property,
  Event,
  OnEvent,
  Address,
  BigInt,
  saveAll,
  BeforeAll,
} from "@spec.dev/core";

/**
 * An ERC1155 Token on Station.
 */
@Spec({
  uniqueBy: ["tokenContractAddress", "tokenId", "chainId"],
})
class Erc1155Token extends LiveTable {
  // The 1155 contract.
  @Property()
  tokenContractAddress: Address;

  // The 1155 token id.
  @Property()
  tokenId: BigInt;

  @BeforeAll()
  setCommonProperties(event: Event) {
    this.tokenContractAddress = event.origin.contractAddress;
  }

  // ==== Event Handlers ===================
  
  @OnEvent("station.ERC1155.TransferSingle")
  onTransferSingle(event: Event) {
    this.tokenId = BigInt.from(event.data.id);
  }

  @OnEvent("station.ERC1155.TransferBatch", { autoSave: false })
  async onTransferBatch(event: Event) {
    const ids = event.data.ids;

    const objectsToSave = [];
    for (let i = 0; i < ids.length; i++) {
      const id = BigInt.from(ids[i]);
      const erc1155Token = this.new(Erc1155Token, {
        tokenContractAddress: this.tokenContractAddress,
        tokenId: id,
      });
      objectsToSave.push(erc1155Token);
    }

    await saveAll(...objectsToSave);
  }
}

export default Erc1155Token;
