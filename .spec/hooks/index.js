const fetch = require('node-fetch')

/**
 * HTTP request vars and constants.
 */
const methods = { POST: 'POST' }
const baseHeaders = { 'Content-Type': 'application/json' }
const webhookUrl = process.env.MEMBERSHIP_MINT_WEBHOOK_URL
const authHeaderName = '<Some-Auth-Token>'
const authToken = process.env.WEBHOOK_AUTH_TOKEN
const zeroAddress = '0x0000000000000000000000000000000000000000'

function stringifyPayload(payload) {
    try {
        return JSON.stringify(payload)
    } catch (err) {
        console.error(`Error stringifying payload:`, payload, err)
        return null
    }
}

/**
 * Hit a webhook on mint of a new membership.
 */
async function onMembershipTransfer(event) {
    const isMint = event.data.from === zeroAddress
    if (!webhookUrl || !isMint) return

    const someData = {
        // ...
    }

    const payload = stringifyPayload(someData)
    if (!payload) return

    let resp
    try {
        resp = await fetch(webhookUrl, {
            method: methods.POST,
            body: payload,
            headers: {
                ...baseHeaders,
                [authHeaderName]: authToken,
            }
        })
    } catch (err) {
        throw `Unexpected error calling webhook ${webhookUrl}: ${err?.message || err}`
    }
    if (resp?.status !== 200) {
        throw `Webhook failed with response code ${resp?.status}`
    }
}

/**
 * Tap into any Spec event.
 */
const eventHandlers = {
    'contracts.station.Membership.Transfer': onMembershipTransfer,
}
  
module.exports = eventHandlers