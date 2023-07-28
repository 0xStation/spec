const relayEventToWebhook = require('./reporter')

/**
 * Relay Membership Transfer events to our custom webhook.
 */
async function onMembershipTransfer(event, db, logger) {    
    await relayEventToWebhook(event, logger)

    // ...
    // Anything else we wanna do that leverages the db object
    // ...
}

/**
 * Tap into any Spec event.
 */
const eventHandlers = {
    'station.Membership.Transfer': onMembershipTransfer,
}
  
module.exports = eventHandlers