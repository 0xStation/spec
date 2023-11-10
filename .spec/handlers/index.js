const relayEventToWebhook = require("./reporter");

/**
 * Process Station metadata queue item.
 */
async function processOnChainItem(event, _, logger) {
  const payload = {
    chainId: Number(event.origin.chainId),
    transactionHash: event.origin.transactionHash,
    contractAddress: event.origin.contractAddress,
    eventSignature: event.origin.signature,
    logIndex: event.origin.logIndex,
    data: event.data,
  };

  await relayEventToWebhook(
    process.env.WEBHOOK_URL,
    payload,
    logger
  );
}

/*
* Register a Permit as used on NonceUsed.
*/
async function registerPermitAsUsed(event, db) {
  const moduleAddress = event.origin.contractAddress;
  const signerAddress = event.data.account;
  const nonce = Number(event.data.nonce);
  const chainId = Number(event.origin.chainId);

  await db.table('Permit')
    .update({ used: true })
    .where({ moduleAddress, signerAddress, nonce, chainId });
}

/**
 * Tap into any Spec event.
 */
const eventHandlers = {
  "station.Membership.Transfer@0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef":
    processOnChainItem,
  "station.Points.Transfer@0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef":
    processOnChainItem,
  "station.TokenFactory.ERC20Created@0x41039c8b82bb5a365f56b4f9d87cee99e069b450bfdc3d87696fcd87783f24c1":
    processOnChainItem,
  "station.TokenFactory.ERC721Created@0x25b1a846e96937f571b6f2a73a73cd1925e5c62f86fa04e12d4e67022e09edec":
    processOnChainItem,
  "station.TokenFactory.ERC1155Created@0x219423f6178d1126524af73954b790c814a8b0dabcd8a687e2a5bec02aed62c1":
    processOnChainItem,
  "station.ERC721.Transfer@0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef":
    processOnChainItem,
  "station.ERC20.Transfer@0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef":
    processOnChainItem,
  "station.ERC1155.TransferSingle@0xc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62":
    processOnChainItem,
  "station.ERC1155.TransferBatch@0x4a39dc06d4c0dbc64b70af90fd698a233a518aa5d07e595d983b8c0526c8f7fb":
    processOnChainItem,
  "station.GeneralFreeMintController.NonceUsed@0x2af71f10069c28afc67c3752e87e0e4616a97948d33c8f404a856c0c334b3e01": 
    registerPermitAsUsed,
};

module.exports = eventHandlers;
