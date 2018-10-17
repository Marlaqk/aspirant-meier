const { WebClient } = require('@slack/client');
// An access token (from your Slack app or custom integration - xoxa, xoxp, or xoxb)
const token = process.env.OAUTH_TOKEN;

const web = new WebClient(token);

// This argument can be a channel ID, a DM ID, a MPDM ID, or a group ID
const conversationId = 'DCRMKLYKG';

module.exports = {

    getRequest(request, response) {
        if (request.method == "POST") {
            console.log('hello');
            sendBestand();
            response.end("received POST request.");
        }
        else {
            response.end("Undefined request .");
        }

    }
};

function sendBestand() {
    // See: https://api.slack.com/methods/chat.postMessage
    web.chat.postMessage({ channel: conversationId, text: 'Hello there' })
        .then((res) => {
            // `res` contains information about the posted message
            console.log('Message sent: ', res.ts);
        })
        .catch(console.error);
}
