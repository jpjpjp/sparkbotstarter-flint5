Notes on the steps I took to upgrade my bot built with the node-flint library version 4 to v5 of node-flint.  Your mileage may vary!

## Webhook Change
* Remove var webhook = require('node-flint/webhook');
* change from:
    * app.post('/', webhook(flint));
* to:
    * app.post('/', flint.spark.webhookListen());

## flint.debug seems to be gone
* install and require the standalone debug pacakge
* modify all flint.debug to use standalone debug 

## flint.hears() is no longer a standalone method
* modify all flint.hears to use flint.hears.[phrase, pattern, words] as appropriate

## bot.say now requires a .markdown() or .text() method
The 'markdown' parameter is no longer passed in the body of the say() function.
* Replace all calls to bot.say('message') or bot.say('markdown', 'messages) with
``` 
bot.say('message').text() or
bot.say('message').markdown()
```
Note that if several says are used with some using markdown and some not using markdown, the order that they will show up in the space is not the same as the order they are called.  To avoid this use markdown() for all (or no) say calls, or explicitly have a then handler for each say, ie:
```
bot.say('message1')
  .then(() => bot.say('message2')
  // and if you want to catch api or app framework errors, and avoid the unhandled promise rejection log
  .catch(err => console.error(err);
```
## bot.exit() is no longer a function
* Use bot.room.exit() instead

## trigger.args no longer exists
* replace with trigger.message.array, ie: replace a command like this:

  let phrase = trigger.args.slice(1).join(" ");

* with

  let phrase = trigger.message.array.slice(1).join(" ");

## trigger.roomId no longer exists
* use trigger.room.id

## trigger.roomTitle no longer exists
* Call the spark roomGet method to get the title, ie:
```
  flint.spark.roomGet(trigger.room.id)  
  .then(room => {
    console.log("This room is called " + room.title);
  })
```

## trigger.[personEmail,displayName] no longer exists
* use trigger.person.email
* use trigger.pseron.displayName

## flint.bots no longer exists
* Replace flint.bots.foreach(){} logic which went down the list of bots and checked the membership
to see if the members need to be notified with:
* flint.spark.membershipsGet() logic which goes down the list of members in spaces with bots and then calls flint.query(roomID) when it finds a member to be notified

## bot.isDirect and bot.isDirectTo no longer exist
* query if the room is direct: 
```
 bot.room.info.type != 'direct'
```
* get the email of the other user in a direct room:
```
        flint.spark.membershipsGet({roomId: thisRoomId}).then(members => {
          //Find the email of the other user in this one on one room
          var email = '';
          if (members.length < 3) {
            // As a Cisco employee, even one one one spaces
            // have our bot and the Cisco Security user
            // If that is all we find there is no one to notify
            return;
          }
          for (var j=0; j<members.length; j++)
            if ((members[j].personId != myId) && (members[j].personEmail !== 'spark-cisco-it-admin-bot@cisco.com')) {
              email = members[j].personEmail;
              break;
          } 
          if (!email) {return}
```



