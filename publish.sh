rm index.zip 
cd skill
zip -X --recurse-paths ../index.zip *
cd .. 
aws lambda update-function-code --function-name BrowserNavigator --zip-file fileb://index.zip