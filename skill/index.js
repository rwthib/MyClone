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
const baseUrl = "http://alexachrome.scalingo.io/";

const APP_ID = 'amzn1.ask.skill.f22034b7-53d6-4553-ae43-fc8f6963408c' // TODO replace with your app ID (OPTIONAL).

const handlers = {
    'NewSession': function () {
        this.attributes.speechOutput = this.t('WELCOME_MESSAGE', this.t('SKILL_NAME'));
        // If the user either does not reply to the welcome message or says something that is not
        // understood, they will be prompted again with this text.
        this.attributes.repromptSpeech = this.t('WELCOME_REPROMT');
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },
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
            this.emit(':askWithCard', action, this.attributes.repromptSpeech, cardTitle, action);

            console.log("Browser action is: " + action);
            // request.post(
            //     baseUrl,
            //     { json: { action: action } },
            //     function (error, response, body) {
            //         if (!error && response.statusCode == 200) {
            //             console.log(body);
            //         } else if (error) {
            //             console.log(error);
            //         } else {
            //             console.log(response.statusCode);
            //         }
            //         console.log('done');
            //     }
            // );
            http.get("http://timnederveen.nl", function(res) {
              console.log("Got response: " + res.statusCode);
            }).on('error', function(e) {
              console.log("Got error: " + e.message);
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
            WELCOME_MESSAGE: "Welcome to %s. You can control your browser via actions like, navigate back, visit facebook ... Now, what can I help you with.",
            WELCOME_REPROMT: 'For instructions on what you can say, please say help me.',
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

exports.handler = (event, context) => {
    const alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};
