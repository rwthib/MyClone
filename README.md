# Alexa ChromeControl

Chrome Control allows you to control your browser and navigate solely by voice, using Amazon Alexa (e.g. via one of your Echo devices). Developed during HackUPC in Barcelona, this POC consists of an Alexa skill, Chrome browser extension, and server that relays the skill's restful requests to the plugin over a websocket connection. Actions already implemented include:
- google voice search
- tab history traversal
- link highlighting
- selecting and following links
- opening and closing of tabs	
- scrolling
- directly loading popular websites
- refreshing
- simulate relevant button presses, such as enter or spacebar

A short demo on youtube: https://www.youtube.com/watch?v=8jgcFP1MyF0

## Setup

To install the skill, follow the following steps:
1. Deploy the server on any platform
2. Update the 'baseUrl' constant of the index.js file in the skill directory to the base url via which your server is now reachable
3. Update the 'socket' var of the background.js file in the extension directory to the base url via which your server is now reachable
4. Install the chrome extension found in the extension folder as described in https://developer.chrome.com/extensions/getstarted#unpacked
5. Configure and upload your skill via the AWS CLI as described in this link (use the already included publish.sh to re-upload) https://developer.amazon.com/blogs/post/Tx1UE9W1NQ0GYII/publishing-your-skill-code-to-lambda-via-the-command-line-interface
6. The setup should now be complete, and if the skill was uploaded correctly it has been automatically made available for usage on Alexa devices on which you are logged in with your Amazon account. Test the skill by asking 'Alexa, start ChromeControl'

## Setup

## Future Goals / TODO
- Include login by amazon account ID on plugin side, to match installed skills to installed plugins and enable a single server to manage communications for all users
- Optionally use AWS IoT Pub/Sub service for all Lambda / Extension communication, which would allow removal of the server and replace socket&#46;&#8203;io with [MQTT](https://github.com/jimmyn/aws-mqtt-client)
- Inject [Web Speech API](https://developers.google.com/web/updates/2013/01/Voice-Driven-Web-Apps-Introduction-to-the-Web-Speech-API) for filling in forms or search boxes
- Expand intents and sample utterances for better and more natural query recognition
- Web dashboard for users to add their own preferred sites as shortcuts
- Implement additional features such as opening favourites and filling in search boxes