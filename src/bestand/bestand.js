const { WebClient } = require('@slack/client');
const https = require('https');
const fetch = require("node-fetch");
// An access token (from your Slack app or custom integration - xoxa, xoxp, or xoxb)
const token = process.env.OAUTH_TOKEN;
const channelId = process.env.CHANNEL_GENERAL;
//const channelId = process.env.CHANNEL_RALPH;

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
    getUserList();
}

function getUserList() {
    var url = 'https://slack.com/api/users.list?token=' + process.env.OAUTH_TOKEN;
    https.get(url, (resp) => {
        let data = '';
        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
            data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            var members = JSON.parse(data).members;
            // filtering of slackbot does not work
            getPresence(members.filter(member => !member.is_bot && !member.name.includes('slackbot')));
        });

    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });
};

async function getPresence(members) {
    var online = 0;
    var awayText = '';
    var map = new Map();
    // length 6
    /*     members
            .forEach( member => getPresenceForMember(member)); */
    for (var i = 0; i < members.length; i++) {
        if (await getPresenceForMember(members[i])) {
            online++;
        } else {
            var status = members[i].profile.status_text;
            if (map.has(status)) {
                map.set(status, map.get(status)+1);
            } else {
                map.set(status, 1);
            }
        }
    }
    map.forEach((value, key, map) => {
        if (awayText > '') {
            awayText += ', ';
        }
        if (key > "") {
            awayText += value + "x mal " + key;
        } else {
            awayText += value + "x mal Offline";
        }
    });
    sendBestandToRandom(members.length, online, awayText);
}

async function getPresenceForMember(member) {
    var url = 'https://slack.com/api/users.getPresence?token=' + process.env.OAUTH_TOKEN + '&user=' + member.id;
    try {
        const response = await fetch(url);
        const presenceData = await response.json();
        if (presenceData.presence === 'active') {
            return true;
        }
        return false;
    } catch (error) {
        console.log(error);
    }
}

function sendBestandToRandom(complete, online, awayText) {
    var msg = 'Zug Meier: Bestand ' + complete + ' Ahwesend ' + online;
    if (awayText > '') msg += " " + awayText;
    web.chat.postMessage({ channel: channelId, text: msg })
        .then((res) => {
            // `res` contains information about the posted message
            //console.log('Message sent: ', res.ts);
        })
        .catch(console.error);
}
