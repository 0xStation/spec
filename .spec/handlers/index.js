const relayEventToWebhook = require("./reporter");

async function processOnChainItem(event, db, logger) {
  delete event.data.contractAddress;
  delete event.data.transactionHash;

  const payload = {
    chainId: event.origin.chainId,
    transactionHash: event.origin.transactionHash,
    contractAddress: event.origin.contractAddress,
    eventSignature: event.origin.signature,
    logIndex: event.origin.logIndex,
    data: event.data,
  };

  await relayEventToWebhook(payload, logger);
}
/**
 * Relay Membership Transfer events to our custom webhook.
 */
async function onMembershipTransfer(event, db, logger) {
  await relayEventToWebhook(event, logger);
  /*
        Anything else you wanna do that leverages the 'db' object:
        -----------------------------------------------------------

        // Insert example
        await db.table("MyTable").insert({ column1: "value1", column2: "value2" })

        // Update example
        await db.table("MyTable").update({ column1: "value1" }).where({ column2: "value2" })
    */
}

/**
 * Tap into any Spec event.
 */
const eventHandlers = {
  "station.Membership.Transfer": processOnChainItem,
};

module.exports = eventHandlers;
