const relayEventToWebhook = require("./reporter")

/**
 * Process Station metadata queue item.
 */
async function processOnChainItem(event, db, logger) {
  const payload = {
    chainId: Number(event.origin.chainId),
    transactionHash: event.origin.transactionHash,
    contractAddress: event.origin.contractAddress,
    eventSignature: event.origin.signature,
    logIndex: event.origin.logIndex,
    data: event.data,
  }

  // API path for the webhook
  const API_PATH = "api/v1/processQueueItem"
  // staging
  await relayEventToWebhook(`https://dev.groupos.xyz/${API_PATH}`, payload, logger)
  // production
  await relayEventToWebhook(`https://groupos.xyz/${API_PATH}`, payload, logger)
}

/**
 * Tap into any Spec event.
 */
const eventHandlers = {
  "station.Membership.Transfer@0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef": processOnChainItem,
  "station.Points.Transfer@0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef": processOnChainItem,
  "station.ERC721.Transfer@0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef": processOnChainItem,
  "station.TokenFactory.ERC20Created@0x41039c8b82bb5a365f56b4f9d87cee99e069b450bfdc3d87696fcd87783f24c1": processOnChainItem,
  "station.TokenFactory.ERC721Created@0x25b1a846e96937f571b6f2a73a73cd1925e5c62f86fa04e12d4e67022e09edec": processOnChainItem,
  "station.TokenFactory.ERC1155Created@0x219423f6178d1126524af73954b790c814a8b0dabcd8a687e2a5bec02aed62c1": processOnChainItem,
}

module.exports = eventHandlers
