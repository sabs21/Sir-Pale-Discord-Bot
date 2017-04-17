const Discord = require("discord.js");
const bot = new Discord.Client();
const http = require('http');
const request = require('request');
const cheerio = require('cheerio');
const express = require('express');
const fs = require('fs');

var w, x, y, z, a, b, count
var imagearr = [1,2,3];
var uptime = 0;
var server = http.createServer();
var app = express();

bot.on('ready', () => {
  console.log(`Logged in as ${bot.user.username}!`);
  //ImgurRequest();
  //IfunnyRequest();
  /*for (var i = 0; i < 10; i++) {
    x = ImgurRequest();
    imagearr.push(x);
  }*/
});
//------------------------------------------------- START OF COMMANDS ----------------------------------------------------------
bot.on('message', msg => {
  if (commandIs('help', msg)) { // for people to view the commands!
    msg.reply("Here's a list of all my commands: !imgur, !roll, !uptime.")
  }
  if (commandIs('roll', msg)) { // a simple dice to roll!
    var args = msg.content.split(/[ ]/);
    if (msg.content ==="!roll") {
      msg.reply('Proper syntax for this command: !roll [Number of dice to roll] [How many faces does the dice have?] (The default amount of faces is 6)')
    }
    else {
      msg.reply(Roll(args[1], args[2]));
    }
  }
  if (commandIs('uptime', msg)) { // this is posts the bot's uptime, the code below accounts for grammar.
    x = uptime % 60;
    y = Math.floor(uptime / 60);
    z = Math.floor((uptime / 60)/60);
    if (uptime < 60) {
      msg.reply('This bot has been running for ' + x + ' seconds.');
    }
    else if (uptime >= 60 && uptime < 3600) {
      msg.reply('This bot has been running for ' + (y % 60) + ' minutes and ' + x + ' seconds.');
    }
    else {
      msg.reply('This bot has been running for ' + z + ' hours, ' + (y % 60) + ' minutes and ' + x + ' seconds.')
    }
  }
  if (commandIs('imgur', msg)) { // This should bring a truly random imgur link, still needs to be able to detect removed images.
    msg.reply(ImgurRequest());
  }
  if (commandIs('ifunny', msg)) {
    app.get('/', function(req, res) {
      url = 'https://ifunny.co/feeds/shuffle';
      var $ = cheerio.load(body);
      request(url, function(error, response, html) {
        if (!error) {
          //var ifunnylink = {y:""};
          $('.media_image').filter(function() {
            var data = $(this);
            y = data.children().first().text();
            //ifunnylink.y = y;
            console.log("y");
            msg.reply(y);
          })
        }
        else {msg.reply("Theres a problem!");}
      })
    })
  }
});
//--------------------------------------------------- END OF COMMANDS -----------------------------------------------------------
bot.onload = setInterval(function() {Uptime()}, 1000); //This counts how long the server has been up. This is for the uptime command.

bot.login('MjkzNDE3MDc0MzUxNDA3MTA0.C7GRmQ.Iw0J5M_RCwFZ9FMyIXGjvK6izJo'); //This is so the bot can login to Discord.
/*------------------------------------------------------ START OF FUNCTIONS ------------------------------------------------------
Function that contribute to a certain command will be grouped together, seperated by underscores ( _ ) and a comment will tell
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
function Roll(a, b) {
  if (b == undefined) {
    b = 6;
  }
  y = 0;
  for (i = 1; i <= a; i++) {
    if (i == a) {
      x = Math.ceil(Math.random()*b);
      y = y + x + '.';
    }
    else if (i == a - 1) {
      x = Math.ceil(Math.random()*b);
      y = y + x + ' and '
    }
    else {
      x = Math.ceil(Math.random()*b);
      y = y + x + ', ';
    }
  }
  return "You've rolled a " + y;
}/* This a simple dice rolling command. It should take the users number input after !roll and use that to generate more dice rolls.
(ex. !roll 2) This rolls 2 dice.
________________________________________________________________________________________________________________________________*/
function Uptime() {
  uptime += 1;
  return uptime;
}/* This simply returns how long the server has been up in seconds.
(ex. !uptime)
________________________________________________________________________________________________________________________________*/
function RandomNum(a,b) {
  x = Math.floor(Math.random()*a)+b;
  return x;
}
function Upper() {
  x = Math.floor(Math.random()*26)+65;
  y = String.fromCharCode(x);
  return y;
}
function Lower() {
  x = Math.floor(Math.random()*26)+97;
  y = String.fromCharCode(x);
  return y;
}
function CharRandom() {
  for (var i = 0, z = '', y, x, fivetoseven = RandomNum(3,4); i <= fivetoseven; i++) {
    x = Math.random();
    if (x < .333) {
      y = Upper();
    }
    else if (x > .333 && x < .666) {
      y = Lower();
    }
    else {
      y = Math.round(Math.random()*9)
    }
    z = z + y;
  }
  return z;
}
function Imgur() {
  x = "http://i.imgur.com/" + CharRandom();
  return x;
}
function ImgurRequest() {
  x = Imgur();
  request
  .get(x)
  .on('response', function(response) {
    if (response.statusCode != 200) {
      console.log('Retrying Imgur...');
      ImgurLoop();
    }
    else {
      console.log('Success! (Imgur)' + x);
      w = x;
    }
 })
  if (w != undefined) {
    return w;
  }
}
function ImgurLoop() {
  ImgurRequest();
}/* This generates a random string between 5 - 7 characters, inserts that into a base imgur link, then posts the link.
(ex. !imgur) This still needs the ability to check the link for 404 and/or removed images.
________________________________________________________________________________________________________________________________*/
/*-------------------------------------------------------- END OF FUNCTIONS ------------------------------------------------------

General notes of psuedo-code or what I would like to add in the future:

1. Use GET request to get the shuffle page of ifunny.
2. Within that HTML, find the first images URL.
3. Queue the first images URL to be posted.
4. Use request to GET the first image's HTML page.
5. Within that page, look for the ID of the next arrow, copy arrows href.
6. Queue that URL to be posted.
7. Repeat 5 and 6.

Daily whale fact
*/
