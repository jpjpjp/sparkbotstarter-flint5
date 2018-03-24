# sparkbotstarter-flint5
Starter kit template for a simple Cisco Spark bot using node-flint version 5

This project is a fork of the original sparkbotstarter here: https://github.com/valgaze/sparkbotstarter

The goal of the project was to help determine what type of tasks developers might face if they want to update their own bots to flint-5.    [Some of the tasks discovered](flint4-5-migrationNotes.md).  You can also look at the changes in the intial-flint-5-changes branch of this project.

Another goal of this project is to determine the steps needed for a bot built using flint5 to work with the [bot-test-framework](https://github.com/jpjpjp/bot-test-framework-example)

# Original sparkbotstart release notes
Starter kit template for a simple Cisco Spark bot

(For a more detailed explanation, see the companion blog post here: https://medium.com/@valgaze/from-zero-to-cisco-spark-bot-nodejs-69224cb9ebb5#.bq5vrzi17)


![What we're making](https://cdn-images-1.medium.com/max/1440/1*H3dXxkQbO7lrbKaEUIHObQ.gif)


## Checklist (absolute bare minimum to get a helloworld bot working)

Prerequisites:

- [ ] node.js (minimum supported v4.2.6 with *use-strict* runtime flag & npm 2.14.12 and up)

- [ ] Sign up for Cisco Spark (logged in with your web browser)

----

- [ ] Create a Cisco Spark Bot (save the API key): https://developer.ciscospark.com/add-bot.html

- [ ] Sign up for nGrok (save API key) and start it on your machine (save the port number and public web address): https://ngrok.com/download

- [ ] Join a room in Cisco Spark

- [ ] Add the bot to the room in Spark

- [ ] Obtain the roomId from an authenticated GET using the Cisco Spark API: https://developer.ciscospark.com/endpoint-rooms-get.html

- [ ] Create a webhook with the roomId and using your nGrok address, roomId, by POSTing to Cisco Spark API: https://developer.ciscospark.com/endpoint-webhooks-post.html

- [ ] Add the port/nGrok address and API bot key to your bot server config.json

- [ ] Turn on your bot server with ```npm start```
