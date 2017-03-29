/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
/**
  *
  * TODO:
  * - Include unique amazon account ID in http request and use that as socket.on action string
  * - General intents instead of multiple specific string matches
  * - use this.event & this.context
 **/

'use strict';

const Alexa = require('alexa-sdk');
const actions = require('./recipes');
const request = require('request');
const http = require('http');
const baseUrl = '<YOUR_SERVER_URL>';      //Replace this with your own server URL


const APP_ID = '<YOUR_APP_ID>'; // Replace with your app ID (OPTIONAL).

const handlers = {
    // 'NewSession': function () {
        
    //     this.attributes.speechOutput = this.t('WELCOME_MESSAGE', this.t('SKILL_NAME'));
    //     // If the user either does not reply to the welcome message or says something that is not
    //     // understood, they will be prompted again with this text.
    //     this.attributes.repromptSpeech = this.t('WELCOME_REPROMPT');
    //     this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);

    // },
    'Unhandled': function () {
        this.emit(':ask', 'ChromeControl started. Control your browser via actions like, search with google, navigate back, scroll down ... Now, what can I help you with.');
    },
    'BrowserNavigator': function () {
        const itemSlot = this.event.request.intent.slots.Item;
        let itemName;
        if (itemSlot && itemSlot.value) {
            itemName = itemSlot.value.toLowerCase();
        }
        console.log("itemName is " + itemName);
        const cardTitle = this.t('DISPLAY_CARD_TITLE', this.t('SKILL_NAME'), itemName);
        const myActions = this.t('ACTIONS');
        const action = myActions[itemName];

        if (action) {   //found
            this.attributes.speechOutput = action;
            this.attributes.repromptSpeech = this.t('ACTION_REPEAT_MESSAGE');
            // this.emit(':askWithCard', action, this.attributes.repromptSpeech, cardTitle, action);

            console.log("Value is: " + action);
            console.log("Key is: " + itemName);

            postRequest({action:itemName}, (result) => {
                if (!result) {
                    this.emit(':tell', 'error during request');
                }
                else {
                    this.attributes.repromptSpeech = this.t('REPROMPT_AGAIN');
                    this.emit(':ask', action, this.attributes.repromptSpeech);
                }
            });

        } else {
            let speechOutput = this.t('ACTION_NOT_FOUND_MESSAGE');
            const repromptSpeech = this.t('ACTION_NOT_FOUND_REPROMPT');
            if (itemName) {
                speechOutput += this.t('ACTION_NOT_FOUND_WITH_ITEM_NAME', itemName);
            } else {
                speechOutput += this.t('ACTION_NOT_FOUND_WITHOUT_ITEM_NAME');
            }
            speechOutput += repromptSpeech;

            this.attributes.speechOutput = speechOutput;
            this.attributes.repromptSpeech = repromptSpeech;

            this.emit(':ask', speechOutput, repromptSpeech);
        }
    },
    'SearchWithGoogle': function () {
        // const itemSlot = this.event.request.intent.slots.Item;
        // let itemName;
        // if (itemSlot && itemSlot.value) {
        //     itemName = itemSlot.value.toLowerCase();
        // }
        // console.log("itemName is " + itemName);
        const cardTitle = this.t('DISPLAY_CARD_TITLE', this.t('SKILL_NAME'), 'Search with Google');
        const myActions = this.t('ACTIONS');

        this.attributes.speechOutput = 'Dictate query';
        this.attributes.repromptSpeech = this.t('ACTION_REPEAT_MESSAGE');
        // this.emit(':askWithCard', action, this.attributes.repromptSpeech, cardTitle, action);
        postRequest({action:'load google'}, (result) => {
            if (!result) {
                this.emit(':tell', 'error during request');
            }
            else {
                this.attributes.repromptSpeech = this.t('REPROMPT_AGAIN');
                this.emit(':ask', 'Dictate query', this.attributes.repromptSpeech);
            }
        });

    },  
    'OpenLink': function () {
        const number = this.event.request.intent.slots.Number.value;
        console.log("Link to select is " + number);
        const action = `select link ${number}`;
        const cardTitle = this.t('DISPLAY_CARD_TITLE', this.t('SKILL_NAME'), action);
        const myActions = this.t('ACTIONS');

        this.attributes.speechOutput = `Selecting link ${number}`;
        this.attributes.repromptSpeech = this.t('ACTION_REPEAT_MESSAGE');
        // this.emit(':askWithCard', action, this.attributes.repromptSpeech, cardTitle, action);
        postRequest({action:action}, (result) => {
            if (!result) {
                this.emit(':tell', 'error during request');
            }
            else {
                this.attributes.repromptSpeech = this.t('REPROMPT_AGAIN');
                this.emit(':ask', 'Link opened', this.attributes.repromptSpeech);
            }
        });

    },  
    'AMAZON.HelpIntent': function () {
        this.attributes.speechOutput = this.t('HELP_MESSAGE');
        this.attributes.repromptSpeech = this.t('HELP_REPROMT');
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },
    'AMAZON.RepeatIntent': function () {
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },
    'AMAZON.StopIntent': function () {
        this.emit('SessionEndedRequest');
    },
    'AMAZON.CancelIntent': function () {
        this.emit('SessionEndedRequest');
    },
    'SessionEndedRequest': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
};

const languageStrings = {
    'en': {
        translation: {
            ACTIONS: actions.ACTIONS_EN_GB,
            SKILL_NAME: 'Browser Navigator',
            WELCOME_MESSAGE: "Welcome to %s.",
            REPROMPT_AGAIN: "Can I help you with something else?",
            WELCOME_REPROMPT: "You can control your browser via actions like, navigate back, visit facebook ... Now, what can I help you with.",
            DISPLAY_CARD_TITLE: '%s  - Action for %s.',
            HELP_MESSAGE: "You can ask questions such as, what\'s the browser action, or, you can say exit...Now, what can I help you with?",
            HELP_REPROMT: "You can say things like, what\'s the browser action, or you can say exit...Now, what can I help you with?",
            STOP_MESSAGE: 'Goodbye!',
            ACTION_REPEAT_MESSAGE: 'Try saying repeat.',
            ACTION_NOT_FOUND_MESSAGE: "I\'m sorry, I currently do not know ",
            ACTION_NOT_FOUND_WITH_ITEM_NAME: 'an action named %s. ',
            ACTION_NOT_FOUND_WITHOUT_ITEM_NAME: 'that browser action. ',
            ACTION_NOT_FOUND_REPROMPT: 'What else can I help with?',
        },
    }
};

function postRequest(input, callback) {
    
    var options = {
      host: baseUrl,
      path: '/action',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    var req = http.request(options, (res) => {
        callback(res.statusCode === 200)
    });

    req.on('error', (e) => {
        console.log(`problem with request: ${e.message}`);
        // this.emit(':tell', 'error during request');
        callback(false);
    });
    req.write(JSON.stringify(input));
    req.end();
} 

exports.handler = (event, context) => {
    const alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};
