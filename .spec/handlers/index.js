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
}

module.exports = eventHandlers
