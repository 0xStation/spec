/**
 * Mark Actions as successful upon receiving the "Execute" contract event.
 */
async function onExecuteEvent(event, db, logger) {
    const chainId = Number(event.origin.chainId)
    const { actionDigest } = event.data

    // Update Action record.
    const numRecordsUpdated = await db.table('Action')
        .update({ status: 'SUCCESS' })
        .where({ chainId, actionDigest })
    
    // Log result.
    numRecordsUpdated
        ? logger.info(`Updated ${numRecordsUpdated} Action record${numRecordsUpdated > 1 ? 's' : ''}.`)
        : logger.error(`No Action record found for (chainId=${chainId}, actionDigest=${actionDigest}).`)
}

/**
 * Tap into any Spec event.
 */
const eventHandlers = {
    'contracts.station.ParallelProcessor.Execute': onExecuteEvent,
}

module.exports = eventHandlers