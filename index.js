/*
Heavily based off Nick Marus' node-flint framework helloworld example: https://github.com/nmarus/flint
*/

var Flint = require('node-flint');
var express = require('express');
var bodyParser = require('body-parser');
const debug = require("debug")("sparkbot");
var app = express();
app.use(bodyParser.json());
const config = require("./config.json");

// init flint
var flint = new Flint(config);
flint.start();
console.log("Starting flint, please wait...");

flint.on("initialized", function() {
  console.log("Flint initialized successfully! [Press CTRL-C to quit]");
});

/****
## Process incoming messages
****/


/* On mention with command
ex User enters @botname /hello, the bot will write back
*/
// At the moment Flint5 strips the slashes off of commands...
//flint.hears.phrase('/hello', (bot, trigger) => {
flint.hears.phrase('hello', (bot, trigger) => {
    console.log("/hello fired");
  bot.say(`${trigger.person.displayName}, you said hello to me!`).text();
});

/* On mention with command, using other trigger data, can use lite markdown formatting
ex "@botname /whoami"
*/
//flint.hears.phrase('/whoami', function(bot, trigger) {
flint.hears.phrase('whoami', function(bot, trigger) {
  console.log("/whoami fired");
  //the "trigger" parameter gives you access to data about the user who entered the command
  let roomId = "*" + trigger.room.id + "*";
  let personEmail = trigger.person.email;
  let personDisplayName = trigger.person.displayName;
  //This apparently is no longer stored anywhere in the trigger object so bots that want to 
  //use the roomTitle that a bot is in must call GET on the /rooms/trigger.room.id
  //let roomTitle = "**" + trigger.roomTitle + "**";
  flint.spark.roomGet(trigger.room.id)
  .then(room => {
    let roomTitle = "**"+room.title+"**";
    let outputString = `${personDisplayName} here is some of your information: \n\n\n **Room:** you are in "${roomTitle}" \n\n\n **Room id:** ${roomId}`;
    bot.say(outputString).markdown()
    .then(() => {
      outputString = ` **Email:** your email on file is *${personEmail}*`;
      bot.say(outputString).markdown();
    });
  });
});

/* On mention with command say goodbye and leave the room
*/
//flint.hears.phrase('/leave', function(bot, trigger) {
flint.hears.phrase('leave', function(bot, trigger) {
  console.log("/leave fired");
  bot.say("OK.  I know when I'm not wanted...").text()
  .then(() => bot.room.exit())
  .catch(err => console.error(err.message));
});

/* On mention with command arguments
ex User enters @botname /echo phrase, the bot will take the arguments and echo them back
*/
//flint.hears.phrase('/echo', function(bot, trigger) {
flint.hears.phrase('echo', function(bot, trigger) {
  console.log("/echo fired");
//  let phrase = trigger.args.slice(1).join(" ");
  let phrase = trigger.message.array.slice(1).join(" ");
  let outputString = `Ok, I'll say it: "${phrase}"`;
  bot.say(outputString).text();
});

/*
 * I thought this would ONLY fire if the previous ones didn't
 * doesn't seem to be the case 
 * /
// flint.hears.pattern("/.* /, (bot, trigger) => {
//   console.log("Garbage trigger fired");
//   bot.say('Don\'t know how to respond to %d', trigger.message.normalized).text();
// });


/****
## Server config & housekeeping
****/

app.post('/', flint.spark.webhookListen());

var server = app.listen(config.port, function () {
  debug('Flint listening on port %s', config.port);
});

// gracefully shutdown (ctrl-c)
process.on('SIGINT', function() {
  debug('stoppping...');
  server.close();
  flint.stop().then(function() {
    process.exit();
  });
});
