# Alexa ChromeControl

Control your chrome browser with your Amazon Echo via Alexa. This POC, developed during HackUPC in Barcelona, consists of an Alexa skill, Chrome browser extension, and server that relays the skill's restful requests to the plugin over a websocket connection. Actions already implemented include tab history traversal, link navigation, scrolling, and loading of popular websites.

Short demo on youtube: https://www.youtube.com/watch?v=iCnNRsLW0ns

TODO: 
- include unique amazon account ID in http request and use that as socket.on action string
- General intents instead of multiple specific string matches
- Complete generic link selection
- replace specific numbers with count literal
- use this.event & this.context
- add login to couple multiple user with their own plugin
- newSession welcome message if invoked without arguments