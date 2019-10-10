const discord = require('discord.js');
const bot = new discord.Client();
const http = require('http');
const request = require('request');
const cheerio = require('cheerio');
const express = require('express');
const fs = require('fs');

var command = require('./command.js');
var imgur = require('./imgur.js');
var slots = require('./slots.js');
var seperator = require('./thousandsSeperator.js');
var encoder = require('./encoder.js');
var emojis = require('./emojis.js');
var translator = require('./translate.js');

var uptime = 0;
var server = http.createServer();
var app = express();
var jsonfilepath = './credits.json';
var jsonfile = require(jsonfilepath);
var creditsys;
var creditsysobj;
var userobj;
var obtaineduserid;
var arraycrates = [];

bot.on('ready', () => {
  console.log(`Logged in as ${bot.user.username}!`);
  fs.readFile(jsonfilepath, "utf-8", (err, data) => {
    if (err) throw err;
    console.log(data);
    creditsys = data.toString();
    creditsysobj = JSON.parse(data);
  });
  setInterval(function() {emojis.storeRegen()}, 60000);  // This helps regenerate the emoji store by checking if the time goes above 1 hour. This iterates each minute the bot runs.
  setInterval(function() {Uptime()}, 1000);  // This counts how long the server has been up. This is for the uptime command.
  //console.log(guild.name);
});
//------------------------------------------------- START OF COMMANDS ----------------------------------------------------------
bot.on('message', msg => {

  //const discord = require("discord.js");
  obtaineduserid = "id_" + msg.author.id;                                         // Extra variables that fit the scope. This gets the discord user's ID.
  userobj = creditsysobj[obtaineduserid];                                         // This allows access to the user's json objects.

  if (commandIs('help', msg)) {
    msg.reply(command.help());                                                    // Displays instructions on how to use each command.
  }

  else if (commandIs('roll', msg)) {                                              // A simple dice to roll!
    var args = msg.content.split(/[ ]/);
    if (msg.content === "!roll") {
      msg.reply(command.rollhelp());                                              // Displays instruction on how to use roll.
    }
    else {
      msg.reply(command.roll(args[1], args[2]));
    }
  }

  else if (commandIs('uptime', msg)) {                                            // This displays the bot's uptime, the code below accounts for grammar.
    msg.reply(command.uptime(uptime));
  }

  else if (commandIs('imgur', msg)) {                                             // This gets you a truly random imgur link.
    if (datehandler("randomimagetime", 0, 2) == 0) {
      imgur.getImage(function(callback) {
        msg.reply(callback);
        creditchanger(1, 5, null, true);
      });
    }
  }

  else if (commandIs('ifunny', msg)) {                                            // This brings a random ifunny link!
    if (datehandler("randomimagetime", 0, 2) == 0) {
      command.ifunny(function(img) {
        msg.reply(img);
        creditchanger(1, 5, null, true);
      });
    }
  }

  else if (commandIs('define', msg)) {                                            // This defines a word for you! (English)
    var args = msg.content.split(/[ ]/);
    if (args[1] === undefined) {
      msg.reply(command.definehelp());                                            // This displays instructions on how to use define
    }
    else {
      if (args[2] != undefined) {
        args[1] = args[1] + "%20" + args[2];
      }
      command.define(args[1].toLowerCase(), function(callback) {
        msg.reply(callback);
      });
    }
  }

  else if (commandIs('slots', msg)) {                                             // Play slots! By default, 1 credit is spent by default each time you play!
    if (commandIs('slots score', msg)) {
      msg.reply(slots.help());                                                    // This displays information on the scores for slots.
    }
    else {
      var args = msg.content.split(/[ ]/);
      if (userobj == undefined) {
        creditchanger(1, 0);
      }
      var play = slots.playSlots(args[1], userobj.credits);
      msg.reply(play[0]);
      if (play[1] != 0) {
        creditchanger(1, play[1], null, true);
      }
    }
  }

  else if (commandIs('bal', msg)) {
    if (creditchanger(1, 0) === false) {
      msg.reply("You are at the credit limit! The economy is in shambles because of you.");
    };
    msg.reply("You currently have $" + seperator.thousands(userobj.credits) + ".")
  }

  else if (commandIs('crate', msg)) {
    if (datehandler("hourlytime", 60, 0, false) == 0) {
      const collector = new discord.MessageCollector(msg.channel, m => m.author.id === msg.author.id, { maxMatches: 1, time: 20000});
        msg.reply("Choose a crate! 1 - 5 (Reply with just a number)");
        collector.on("collect", msg => {
          var x = parseInt(msg.content.replace(/([^0-9])/g, "").toString());
          if ((x <= 5) && (x >= 1)) {
            for (i = 0; i < 5; i++) {
              arraycrates[i] = Math.ceil(Math.random()*899) + 100;
            }
            datehandler("hourlytime", 60);
            creditchanger(1, arraycrates[x - 1], null, true);
            msg.reply("You've opened a crate worth $" + arraycrates[x - 1] + "!");
            console.log("(Crates) " + msg.author.username + " has won " + arraycrates[x - 1] + " credits.");
            arraycrates.sort(function (a, b) { return a - b });
            msg.reply("The highest value crate was worth $" + arraycrates[arraycrates.length - 1] + ".")
          }
          else {
            msg.reply("Please input a number 1 - 5. Try the crates command again!");
          }
        });
    }
    else {
      console.log("(Crates) No crates for " + msg.author.username + "!");
    }
  }

  else if (commandIs('crypto', msg)) {
    var args = msg.content.split(/[ ]/);
    if (args[1] == undefined) {
      args[1] = "bitcoin";
    }
    else if (args[2] != undefined) {
      args[1] = args[1] + "-" + args[2];
    }
      command.cryptoinfo(args[1].toLowerCase(), function(callback) {
        msg.reply(callback);
      });
  }

  else if (commandIs('encode', msg)) {
    //var args = msg.content.split(/[ ]/);
    msg.reply("Choose an encryption method: Morse Code (mc), Binary (io), Caesar's Cipher (cc)");
    const collector = new discord.MessageCollector(msg.channel, m => m.author.id === msg.author.id, { maxMatches: 1, time: 20000});  // User chooses either io or cc here.
    collector.on("collect", msg => {
      var encryptpick = msg.content.toString();  // The choice is saved for the future if statements.
      if (encryptpick == "cc" || encryptpick == "io" || encryptpick =="mc") {  // Checks for a valid response from the user.
        msg.reply("Type what you want encoded!");
        const collector2 = new discord.MessageCollector(msg.channel, m => m.author.id === msg.author.id, { maxMatches: 1, time: 20000});  // User enters their message here.
        collector2.on("collect", msg => {
          var messagestr = msg.content.toString();  // This variable holds the user's message.
          var encodedmsg;  // This variable will contain the final encryption.
          if (encryptpick == "cc") {  // The if statement for Caesar's Cipher
            var shift = Math.ceil(Math.random()*26);  // Creates a random shift to shift each letter up by.
            encodedmsg = encoder.caesar(messagestr, shift).toString();  // Generates the encoded message.
            return msg.reply("Your message was shifted by " + shift + "\nYour encoded message is: ```" + encodedmsg + "```");  // The returned reply.
          }
          else if (encryptpick == "io") {  // The if statement for Binary.
            encoder.binary(messagestr, function(callback) {  // Generates the encoded message 1 letter at a time
              msg.reply("Your encoded message is ```" + callback + "```");  // The returned reply.
            });
          }
          else if (encryptpick = "mc") { // The if statement for Morse Code
            var encodedmsg = encoder.morseencode(messagestr);
            msg.reply("Your encoded message is ```" + encodedmsg + "```\nGuide for proper spacing:\nWait one dot '.' length before starting the next letter in a word.\nAlways hold a dash '_' for three dot '...' lengths.\nWait 7 dot lengths (3 spaces) for spaces between words.");
          }
        });
      }
      else {
        return msg.reply("Please enter a valid encryption method and try again!");  // This will be returned when the user doesn't give a valid input.
      }
    });
  }

  else if (commandIs('decode', msg)) {
    msg.reply("Choose a decryption method: Morse Code (mc), Binary (io), Caesar's Cipher (cc)");
    const collector = new discord.MessageCollector(msg.channel, m => m.author.id === msg.author.id, { maxMatches: 1, time: 20000});  // User chooses either io or cc here.
    collector.on("collect", msg => {
      var decryptpick = msg.content.toString();
      if (decryptpick == "cc") {
        msg.reply("What is the shift number?");
        const collectorcc = new discord.MessageCollector(msg.channel, m => m.author.id === msg.author.id, { maxMatches: 1, time: 20000});
        collectorcc.on("collect", msg => {
          var ccshift = parseInt(msg.content.toString()) * -1;
          if (ccshift == NaN) {
            msg.reply("Not a valid number. Please try the command again.");
          }
          else {
            msg.reply("Type what you want decoded!");
            const collectorcc2 = new discord.MessageCollector(msg.channel, m => m.author.id === msg.author.id, { maxMatches: 1, time: 20000});
            collectorcc2.on("collect", msg => {
              var ccmessagestr = msg.content.toString();
              var decodedmsg = encoder.caesar(ccmessagestr, ccshift);
              return msg.reply("Your decoded message is: ```" + decodedmsg + "```");
            });
          }
        });
      }
      else if (decryptpick == "io") {
        msg.reply("Type what you want decoded!");
        const collectorio = new discord.MessageCollector(msg.channel, m => m.author.id === msg.author.id, { maxMatches: 1, time: 20000});
        collectorio.on("collect", msg => {
          var iomessagestr = msg.content.toString();
          encoder.binarydecode(iomessagestr, function(callback) {
            msg.reply("Your decoded message is: ```" + callback + "```");
          });
        });
      }
      else if (decryptpick == "mc") {
        msg.reply("Type what you want decoded! (Insert a space after each letter, and 3 spaces after each word.)");
        const collectormc = new discord.MessageCollector(msg.channel, m => m.author.id === msg.author.id, { maxMatches: 1, time: 20000});
        collectormc.on("collect", msg => {
          mcstr = msg.content.toString();
          mcdecoded = encoder.morsedecode(mcstr);
          msg.reply("Your decoded message is ```" + mcdecoded + "```");
        })
      }
      else {
        return msg.reply("Please enter a valid decryption method and try again!");
      }
    });
  }

  else if (commandIs('password', msg)) {
    var args = msg.content.split(/[ ]/);
    var pass;
    var NaNtest = isNaN(args[1]);
    if (args[1] === undefined || NaNtest === true) {
      pass = command.password(8);
      msg.author.send("Here's your new password!\n``" + pass + "``\n*(The password length was defaulted to 8. The max password length you can request is 32 characters.)*\n\nSyntax for this command: **!password** [**length of password**] [**adv** (if you want the full range of acceptable characters for your password, type 'adv' without quotes.)]");
    }
    else if (args[1] < 1 || args[1] > 32 && args[1] != "adv") {
      pass = command.password(8);
      msg.author.send("Here's your new password!\n``" + pass + "``\n*(The password length was defaulted to 8. The max password length you can request is 32 characters.)*");
    }
    else if (args[1] != "adv" && args[2] === undefined) {
      pass = command.password(args[1]);
      msg.author.send("Here's your new password!\n``" + pass + "``");
    }
    else if (args[1] === "adv") {
      pass = command.password(8,"adv");
      msg.author.send("Here's your new password!\n``" + pass + "``\n*(The password length was defaulted to 8 with advanced characters. The max password length you can request is 32 characters.)*");
    }
    else {
      pass = command.password(args[1],args[2]);
      msg.author.send("Here's your new password!\n``" + pass + "``");
    }
  }

  else if (commandIs('shop', msg)) {
    //var args = msg.content.split(/[ ]/);
    emojis.storeRegen(function(callback) {
      var embed = new discord.RichEmbed()
      .setTitle("I'll take that money off your hands...")
      .setAuthor("Emoji-Mart")
      .setColor(454650)
      .setThumbnail("https://image000.tutpad.com/tut/0/53/32-done.gif")
      .addField("**#1** " + callback[0].emoji + "    ***" + callback[0].name + "***", "*" + callback[0].grade + "* - This'll cost you $" + seperator.thousands(callback[0].cost))
      .addBlankField(true)
      .addField("**#2** " + callback[1].emoji + "    ***" + callback[1].name + "***", "*" + callback[1].grade + "* - This costs $" + seperator.thousands(callback[1].cost))
      .addBlankField(true)
      .addField("**#3** " + callback[2].emoji + "    ***" + callback[2].name + "***", "*" + callback[2].grade + "* - The price is $" + seperator.thousands(callback[2].cost))
      .addBlankField(true)
      .addField("**#4** " + callback[3].emoji + "    ***" + callback[3].name + "***", "*" + callback[3].grade + "* - You'd pay $" + seperator.thousands(callback[3].cost))
      .addBlankField(true)
      .addField("**#5** " + callback[4].emoji + "    ***" + callback[4].name + "***", "*" + callback[4].grade + "* - That'll be $" + seperator.thousands(callback[4].cost))
      .setFooter("To start a transaction, type the name or number of the emoji you want. Any other response is jibberish to me!");
      msg.channel.send({embed}).catch(console.error);
      const collectoremoji = new discord.MessageCollector(msg.channel, m => m.author.id === msg.author.id, { maxMatches: 1, time: 20000});
      collectoremoji.on("collect", msg => {
        var emojimsg = msg.content.toString();
        var confirm;

        for (i = 0; i < 5; i++) {
        if (emojimsg.toLowerCase() == callback[i].name.toLowerCase() || parseInt(emojimsg) == i + 1) {
            confirm = i;
            console.log(confirm);
            //i = 5;
          }
        }
        if (confirm == undefined) {
          return -1;
        }
        else {
          const confirmemoji = new discord.MessageCollector(msg.channel, m => m.author.id === msg.author.id, { maxMatches: 1, time: 20000});
          var embed = new discord.RichEmbed()
          .setTitle("Reciept for " + msg.author.username + ".")
          .setAuthor("Emoji-Mart")
          .setColor(454650)
          .setThumbnail("https://i.pinimg.com/originals/4f/9b/63/4f9b6352fa82dfe82e27a2c52989aaa9.gif")
          .addField("Purchase Confirmation:", "Are you *sure* you want to buy " + callback[confirm].name + " for $" + seperator.thousands(callback[confirm].cost) + "?")
          .setFooter("Type yes to confirm, anything other than a yes will cancel the transaction.");

          msg.channel.send({embed}).catch(console.error).then((message) => {
            confirmemoji.on("collect", msg => {
              var confirmmsg = msg.content.toString().toLowerCase();
              if (confirmmsg == "yes") {
                if (creditchanger(0, callback[confirm].cost, callback[confirm].emoji) != -1) {
                  var embed = new discord.RichEmbed()
                  .setTitle("Transaction completed by " + msg.author.username + ".")
                  .setAuthor("Emoji-Mart")
                  .setThumbnail("http://puu.sh/A1WJj/af8540c2d2.gif")
                  .setColor(1436697)
                  .addField("You've just purchased " + callback[confirm].name + " for $" + callback[confirm].cost + ".", "Thanks for shopping with us! " + callback[confirm].emoji);
                  message.edit({embed});
                // Edit the confirmation message to say "Sold! One [insert emoji here] for [insert username]!" deduct the money from account, add the emoji to credits.json
                }
                else {
                  var embed = new discord.RichEmbed()
                  .setTitle("Transaction cancelled for " + msg.author.username + ".")
                  .setAuthor("Emoji-Mart")
                  .setThumbnail("http://puu.sh/A1U5T/2b129b7b1c.gif")
                  .setColor(13893632)
                  .addField("Purchase Cancelled.", "Insufficient Funds.");
                  message.edit({embed});
                // Edit the confirmation messsage to say "Insufficient Funds"
                }
              }
              else {
                var embed = new discord.RichEmbed()
                .setTitle("Transaction cancelled for " + msg.author.username + ".")
                .setAuthor("Emoji-Mart")
                .setThumbnail("http://puu.sh/A1U5T/2b129b7b1c.gif")
                .setColor(13893632)
                .addField("Purchase Cancelled.", "I won't confirm a transaction unless I hear a yes!");
                message.edit({embed});
                // Edit the confirmation message to say "Purchase Cancelled"
              }
            });
          });
        }
      });
    });
  }

  else if (commandIs('emoji', msg)) {
    msg.channel.send(msg.author.username + "'s Emoji's => " + userobj.emoji);
  }

  else if (commandIs('notify', msg)) {
    var args = msg.content.split(/[ ]/);  // Seperates user input by each space. (ex. hot diggity! (args[0] = "hot", args[1] = "diggity!")
    if (isNaN(args[1]) == true || args[1] == undefined) {  // Checks to see if the args[1] input is a valid argument. args[1] is used to define how many messages to collect before sending the user a DM.
      if (args[1] == "stop") {  // Notifies the user that they've turned off the bot's notification feature.
        msg.author.send("The notify feature has been stopped.");
      }
      else {
        msg.reply("Syntax: !notify [This number governs how many messages it'll take before you get notified] (Turn off server notifications after activating this. The stop command is '!notify stop')");
      }
    }
    else if (args[1] < 2) {
      msg.reply("Not a valid input for the notify command! You must at least get notified every 2 messages.");
    }
    else {
      const msgcollector = new discord.MessageCollector(msg.channel, m => m.type.default === msg.type.default, {maxMatches: 10000});  // As long as the message isn't within a dm, the collector will collect every message.
      var notifyee = msg.author;
      if (msg.channel.type == "dm") {  // Prevents a user from activating the command in the bot's DM's.
        msgcollector.stop();
      }
      else {
        msg.author.send("You will now be notified every " + args[1] + " messages. Remember to turn off the server's notifications and type the command '!notify stop' to stop recieving notifications from me.");
        var msgcount = 0;  // Starts at 0 and counts upwards until it reaches args[1].
        msgcollector.on("collect", msg => {
          msgcount += 1;
          if (msg.content == "!notify stop" && msg.author == notifyee) {  // The user who initiated the notify command can type '!notify stop' to stop the collector.
            msgcollector.stop();
          }
          else if ((msgcount % args[1]) == 0) {  // When msgcount gets reset to 0 due to the modulus operator, it triggers the DM to be sent to you.
            var msgtime = new Date();
            notifyee.send("Recent activity in " + msg.channel + " as of " + msgtime + ".");
          }
        });
      }
    }
  }

  else if (commandIs('d', msg)) {
    var args = msg.content.split(/[ ]/);
    if (args[0] == '!d') {
      msg.reply("This is the debug command!");
      //translator.translate();
    }
    else {
      return -1;
    }
  }

  function datehandler(editeduserobj, timeoutmin, timeoutsec, editjson) {
    if (creditsys.search(obtaineduserid) == -1) {                                 // If the user isn't in the json file already, make them a part of it!
      creditsysobj[obtaineduserid] = {
        credits: 100,                                                             // This sets the default credits of the new user at 100.
        hourlytime: 0,                                                            // This sets the time to a default time of 0 so that the user may play the hourly game.
        randomimagetime: 0                                                        // This sets a delay for the imgur and ifunny commands.
      };
      userobj = creditsysobj[obtaineduserid];
      console.log("New user! " + obtaineduserid + " (" + msg.author.username + ")" + " has been added to the database.")
    }
    var t = new Date();
    var time = parseInt(t.getTime());                                             // Take the current time and store it in the time variable.
    if (timeoutsec == undefined) {                                                // Defaults the seconds timeout to be 0 if not specified.
      timeoutsec = 0;
    }
    if (timeoutmin == undefined) {                                                // Defaults the minutes timeout to be 0 if not specified.
      timeoutmin = 0;
    }
    if (editjson === undefined) {                                                 // If editjson is true, the JSON will be changed. The hourly time will be set to the current time in milliseconds.
      editjson = true;
    }
    var delaysec = timeoutsec * 1000;                                             // Does the math required to turn milliseconds into both 1 full second and minute.
    var delaymin = timeoutmin * 60000;
    if (time >= (userobj[editeduserobj] + delaymin + delaysec)) {                 // If the current time is past the previously recorded time as well as the added delay...
      if (editjson === false) {                                                   // If editjson is false, no change to the JSON will be made. Your hourly timer will not move.
        return 0;
      }
      else {
        userobj[editeduserobj] = time;
        creditsys = JSON.stringify(creditsysobj, null, 2);                        // Then record the current time as long as editjson is true!
        fs.writeFile(jsonfilepath, creditsys, (err) => {
          if (err) {
            return console.log (err);
          }
        })
        console.log("(Timer) Done!");
        return 0;
      }
    }
    else {
      var timemathroundedmin = Math.ceil(((userobj[editeduserobj] + (delaymin +   // This takes the current time difference and rounds any second to a full minute.
      delaysec)) - time) / 60000);
      var timemathroundedsec = Math.ceil(((userobj[editeduserobj] + (delaymin +   // This takes the current time difference and rounds any millisecond to a full second.
      delaysec)) - time) / 1000);
      var timemath = ((userobj[editeduserobj] + (delaymin + delaysec))            // This gets the current time difference not rounded.
       - time);
      if (timemath <= 60000) {
        msg.reply("You must wait " + timemathroundedsec + " seconds before you can try again");
      }
      else {
        msg.reply("You must wait " + timemathroundedmin + " minutes before you can try again.");
      }
      return -1;
    }
  }

  function creditchanger(posneg, change, emoji, balanceoverride) {
    if (creditsys.search(obtaineduserid) == -1) {                                 // If the user isn't in the json file already, make them a part of it!
      creditsysobj[obtaineduserid] = {
        credits: 100,                                                             // This sets the default credits of the new user at 100.
        hourlytime: 0,                                                            // This sets the time to a default time of 0 so that the user may play the hourly game.
        randomimagetime: 0,                                                       // This sets a delay for the imgur and ifunny commands.
        emoji: null
      }
      userobj = creditsysobj[obtaineduserid];
      console.log("New user! " + obtaineduserid + " (" + msg.author.username + ")" + " has been added to the database.");
    }

    var finalchange;
    if (posneg == 0) {
      finalchange = change * -1;
    }
    else if (posneg == 1) {
      finalchange = change;
    }

    if (userobj.credits == null || userobj.credits == undefined) {
      return msg.reply("You have a balance error, and it's not in your favor.");
    }
    else if (Math.abs(finalchange) <= userobj.credits || (balanceoverride == true)) {  // If the overide is true, the user's balance will be edited regardless of their current balance.
      if (userobj.credits >= 1000000000000 && change >= 0 && posneg == 1) {       // If the user has 1 trillion credits or more and is supposed to gain credits, return the function. That is the limit.
        return false;
      }
      else {                                                                      // Else if posneg is 1, add the amount specified in the second argument of the function (change)
        userobj.credits += finalchange;
      }
      if (emoji != null && emoji != undefined) {
        if (userobj.emoji == null || userobj.emoji == undefined) {
          userobj.emoji = emoji;
        }
        else {
          userobj.emoji += " " + emoji;
        }
      }
      creditsys = JSON.stringify(creditsysobj, null, 2);                          // Creditsysobj is a JSON object, so we must stringify it and overwrite the creditsys var in order to write it to the credit.json file neatly
      fs.writeFile(jsonfilepath, creditsys, (err) => {                            // Write the changes made to jsonfilepath (credits.json)
        if (err) {
          return console.log (err);
        }
      })
      console.log("(Credits) Done! " + change);
    }
    else {
      //msg.reply("You can't afford this! You have " + seperator.thousands(userobj.credits) + " credits.");
      return -1;
    }
  }
});
//--------------------------------------------------- END OF COMMANDS ------------------------------------------------------------
bot.login('MjkzNDE3MDc0MzUxNDA3MTA0.Dh1nHg.563Ksyxu84HWccqP5j_Fkrk5SNU');         // This is so the bot can login to Discord.
/*------------------------------------------------- START OF FUNCTIONS -----------------------------------------------------------
Functions that contribute to a certain command will be grouped together, seperated by underscores ( _ ) and a comment will tell
you which command the functions contribute toward.*/
function commandIs(str, msg) {
  return msg.content.toLowerCase().startsWith("!" + str);
} /* This function governs commands in general. It defines which character the user uses at the start of each command to properly
activate the command.*/
var count = (function() {
  var count = 0;
  return function () {return count += 1;}
})(); /* This function acts as a global counter. Whenever count() is called, this will be incremented by 1.
________________________________________________________________________________________________________________________________*/
function Uptime() {
  uptime += 1;
  return uptime;
}/* This simply returns how long the server has been up in seconds.
(ex. !uptime)
/*-------------------------------------------------------- END OF FUNCTIONS ------------------------------------------------------

General notes of psuedo-code or what I would like to add in the future:

1. Gather list of top 100 most common verbs, nouns, pronouns, and adjectives.
2. Create a good amount of skeleton sentences that specify what kind of word fits in what places (goal = 20).
3. Randomly pick a sentence.
4. Fill in that sentences blanks with random words from a JSON that are fitting (if it specifies noun, it better be a noun).
5. Post the message with the sentence.
6. ALTERNATE IDEA = Use vocab from a linked article in order to use words that are relative to a topic.
Maybe have the bot scan the page for the most common words and use those.
7.

Daily whale fact*/
