/**
 * Mark Actions as successful upon receiving the "Execute" contract event.
 */
async function onSuccessEvent(event, db, logger) {
  const { actionHash } = event.data;

  // Update Action record.
  // Actions unique by actionHash, which is a EIP712 hash deriving from
  // chainId, safe address, nonce, call parameters, version, and verifying contract
  const numRecordsUpdated = await db
    .table("Action")
    .update({ status: "SUCCESS" })
    .where({ actionHash });

  // Log result.
  numRecordsUpdated
    ? logger.info(
        `Updated ${numRecordsUpdated} Action record${
          numRecordsUpdated > 1 ? "s" : ""
        }.`
      )
    : logger.error(`No Action record found for (actionHash=${actionHash}).`);
}

/**
 * Tap into any Spec event.
 */
const eventHandlers = {
  "contracts.station.ParallelProcessor.Success": onSuccessEvent,
};

module.exports = eventHandlers;
