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

TODO: 
- Include login by amazon account ID on plugin side, to match installed skills to installed plugins
- Expand intents and sample utterances for better and more natural query recognition
- Web dashboard for users to add their own preferred sites as shortcuts
- Implement additional features such as opening favourites and filling in search boxes
- Inject [Web Speech API](https://developers.google.com/web/updates/2013/01/Voice-Driven-Web-Apps-Introduction-to-the-Web-Speech-API) for filling in forms or search boxes