/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
/**
 * This sample demonstrates a sample skill built with Amazon Alexa Skills nodejs
 * skill development kit.
 * This sample supports multiple languages (en-US, en-GB, de-GB).
 * The Intent Schema, Custom Slot and Sample Utterances for this skill, as well
 * as testing instructions are located at https://github.com/alexa/skill-sample-nodejs-howto
 **/

'use strict';

const Alexa = require('alexa-sdk');
const actions = require('./recipes');
const request = require('request');
const http = require('http');
const baseUrl = "alexachrome.scalingo.io";

const APP_ID = 'amzn1.ask.skill.f22034b7-53d6-4553-ae43-fc8f6963408c' // TODO replace with your app ID (OPTIONAL).

const handlers = {
    // 'NewSession': function () {
        
    //     this.attributes.speechOutput = this.t('WELCOME_MESSAGE', this.t('SKILL_NAME'));
    //     // If the user either does not reply to the welcome message or says something that is not
    //     // understood, they will be prompted again with this text.
    //     this.attributes.repromptSpeech = this.t('WELCOME_REPROMPT');
    //     this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);

    // },
    'Unhandled': function () {
        this.emit(':ask', 'Unhandled request');
    },
    'BrowserNavigator': function () {
        const itemSlot = this.event.request.intent.slots.Item;
        let itemName;
        if (itemSlot && itemSlot.value) {
            itemName = itemSlot.value.toLowerCase();
        }

        const cardTitle = this.t('DISPLAY_CARD_TITLE', this.t('SKILL_NAME'), itemName);
        const myActions = this.t('ACTIONS');
        const action = myActions[itemName];

        if (action) {   //found
            this.attributes.speechOutput = action;
            this.attributes.repromptSpeech = this.t('ACTION_REPEAT_MESSAGE');
            // this.emit(':askWithCard', action, this.attributes.repromptSpeech, cardTitle, action);

            console.log("Value is: " + action);
            console.log("Key is: " + itemName);

            // https.post(baseUrl, (res) => {
            //             let data = "";
            //             res.on('data', chunk => {
            //                 data = data + chunk.toString();
            //             });
            //             res.on('end', () => {
            //                 let json = JSON.parse(data);
            //                 let event = json[0];
            //                 this.attributes.speechOutput = this.attributes.speechOutput + event.name + " at " + event.place.name + ". It starts at " + event.start_time;
            //                 this.emit(':tell', this.attributes.speechOutput, this.attributes.speechOutput);
            //             });
            // });
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
