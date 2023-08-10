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

  await relayEventToWebhook(payload, logger)
}

/**
 * Tap into any Spec event.
 */
const eventHandlers = {
  "station.Membership.Transfer": processOnChainItem,
}

module.exports = eventHandlers
