const fetch = require('node-fetch')

/**
 * Webhook HTTP request variables.
 */
const methods = { POST: 'POST' }
const webhookUrl = process.env.WEBHOOK_URL
const headers = { 
    'Content-Type': 'application/json',
    'Some-Auth-Header': process.env.WEBHOOK_AUTH_HEADER_TOKEN,
}

/**
 * JSON-stringify payload with protection.
 */
function stringify(payload) {
    try {
        return JSON.stringify(payload)
    } catch (err) {
        return null
    }
}

/**
 * Hit a webhook to report something interesting.
 */
async function report(payload, logger) {
    if (!webhookUrl) {
        logger.error(`Webhook url not configured...`)
        return
    }
    
    const body = stringify(payload)
    if (!body) {
        logger.error(`Error stringifying payload`, payload)
        return
    }

    let resp
    try {
        resp = await fetch(webhookUrl, {
            method: methods.POST,
            body: body,
            headers,
        })
    } catch (err) {
        logger.error(`Unexpected error calling webhook: ${stringify(err)}`)
    }
    if (resp?.status !== 200) {
        logger.error(`Webhook failed with response code ${resp?.status}`)
    }
    
    return resp
}

module.exports = report