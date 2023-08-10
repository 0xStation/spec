const relayEventToWebhook = require("./reporter")

/**
 * Process Station metadata queue item.
 */
async function processOnChainItem(event, db, logger) {
  const payload = {
    chainId: event.origin.chainId,
    transactionHash: event.origin.transactionHash,
    contractAddress: event.origin.contractAddress,
    eventSignature: event.origin.signature,
    logIndex: event.origin.logIndex,
    data: event.data,
  }

  // API path for the webhook
  const API_PATH = "api/v1/processQueueItem"
  // staging
  await relayEventToWebhook(`dev.groupos.xyz/${API_PATH}`, payload, logger)
  // production
  await relayEventToWebhook(`groupos.xyz/${API_PATH}`, payload, logger)
}

/**
 * Tap into any Spec event.
 */
const eventHandlers = {
  "station.Membership.Transfer": processOnChainItem,
}

module.exports = eventHandlers
