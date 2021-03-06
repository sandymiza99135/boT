import express from "express"
import morgan from "morgan"
import bodyParser from "body-parser"
import https from "https"
const event= require("./Helpers/event")
const handleMessage= event.handleMessage
const handlePostback= event.handlePostback
const app = express();
// app configuration
const port = 3000 ||process.env.PORT
// setup our express application
app.use(morgan('dev')); // log every request to the console.
app.use(bodyParser.urlencoded({ extended:false }));
app.use(bodyParser.json()); 
app.enable('trust proxy')
// app routes
// const server =https.createServer(app)
app.get("/",(req,res)=>{
  res.send("hello word")
})
app.get("/webhook",(req, res) => {
 
    const VERIFY_TOKEN = "testbot"
    const hubChallenge = req.query["hub.challenge"];
    const hubMode = req.query["hub.mode"];
    const verifyTokenMatches = (req.query["hub.verify_token"] === VERIFY_TOKEN);
   if (hubMode && verifyTokenMatches) {
    res.status(200).send(hubChallenge);
    } else {
    res.status(403).end();
    }
   })

   app.post('/webhook', (req, res) => {  
   
    // Parse the request body from the POST
    let body = req.body;
  
    // Check the webhook event is from a Page subscription
    if (body.object === 'page') {
  
      // Iterate over each entry - there may be multiple if batched
      body.entry.forEach(function(entry) {

        // Gets the body of the webhook event
        let webhook_event = entry.messaging[0];
        console.log(webhook_event);
      
      
        // Get the sender PSID
        let sender_psid = webhook_event.sender.id;
        console.log('Sender PSID: ' + sender_psid);
      
        // Check if the event is a message or postback and
        // pass the event to the appropriate handler function
        if (webhook_event.message) {
          handleMessage(sender_psid, webhook_event.message);        
        } else if (webhook_event.postback) {
          handlePostback(sender_psid, webhook_event.postback);
        }
        
      });
  
      // Return a '200 OK' response to all events
      res.status(200).send('EVENT_RECEIVED');
  
    } else {
      // Return a '404 Not Found' if event is not from a page subscription
      res.sendStatus(404);
    }
  
  });
 
// warming up the engines !! setta !! go !!!.
app.listen(port, function() {

  console.log('Application running on port: ', port);
});