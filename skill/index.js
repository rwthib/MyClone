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
var md5 = require("blueimp-md5");
const request = require('request');
const http = require('http');
const baseUrl = 'serene-harbor-37271.herokuapp.com';    //TODO Replace this with your own server URL

const APP_ID = 'amzn1.ask.skill.f22034b7-53d6-4553-ae43-fc8f6963408c' //TODO replace with your app ID (OPTIONAL).

const handlers = {
    // 'NewSession': function () {
        
    //     this.attributes.speechOutput = this.t('WELCOME_MESSAGE', this.t('SKILL_NAME'));
    //     // If the user either does not reply to the welcome message or says something that is not
    //     // understood, they will be prompted again with this text.
    //     this.attributes.repromptSpeech = this.t('WELCOME_REPROMPT');
    //     this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);

    // },
    'Unhandled': function () {
        //if no amazon token, return a LinkAccount card
        if (this.event.session.user.accessToken == undefined) {
            this.emit(':tellWithLinkAccountCard', 'Welcome to Chrome Control. To start using this skill, please use the companion app to authenticate on Amazon');
            return;
        } else {
            var amznProfileURL = 'https://api.amazon.com/user/profile?access_token=';
            console.log(amznProfileURL);
            amznProfileURL += this.event.session.user.accessToken;
            //  const self = this;  // <--- pointer to this in the outer function scope
            //  request('http://rest_url...', function(error, response, body) {
            //         if (response) { // we have a success so call the call back
            //             self.emit(":tell", "hello"); //  <--- self points to the object you want
            //         } else {
            //             self.emit(':ask', 'hello');
            //         }
            // }

            request(amznProfileURL, (error, response, body) => {
                if (response) { // we have a success so call the call back
                    // console.log(response);
                    if (response.statusCode == 200) {
                        var profile = JSON.parse(body);
                        // console.log(profile.name);
                        // console.log(profile.email);
                        var hash = md5(profile.email);
                        // console.log(hash);
                        this.attributes['mail'] = profile.email;
                        this.attributes['hash'] = hash;
                        console.log('Mail stored in attributes: ' + this.attributes['mail']);
                        console.log('Hash stored in attributes: ' + this.attributes['hash']);
                        // this.emit(':tell', "Hello " + profile.name.split(" ")[0]);
                        this.emit(':ask', 'ChromeControl started. Control your browser via actions like, search with google, navigate back, scroll down... Now, what can I help you with.');
                    } else {
                        console.log('Error: ' + error);
                        this.emit(':tell', "Welcome to ChromeControl. Something went wrong when connecting to your extension, please try again later");
                    } 
                } else {
                    console.log('Error. No response from Amazon Profile Service. Error: ' + error);
                    this.emit(':tell', "Welcome to ChromeControl. Something went wrong when connecting to your extension, please try again later");
                }
            });

        }

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
            // console.log('getting hash from attributes');
            var hash = this.attributes['hash'];
            var channelAction = hash + itemName;
            postRequest({action:channelAction}, hash, (result) => {
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
        // console.log('getting hash from attributes');
        var hash = this.attributes['hash'];
        var channelAction = hash + 'load google';
        postRequest({action:channelAction}, hash, (result) => {
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
        // console.log('getting hash from attributes');
        var hash = this.attributes['hash'];
        var channelAction = hash + action;
        postRequest({action:channelAction}, hash, (result) => {
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
            ACTIONS: actions.ACTIONS_EN,
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

function postRequest(input, hash, callback) {
    
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

    // Prepend the MD5 hash to action, to help server determine to which channel to publish to
    var content = JSON.stringify(input);
    console.log("Sending request for: " + content);
    req.write(content);
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
