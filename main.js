const Discord = require("discord.js");
const bot = new Discord.Client();
const http = require('http')
var x, y;

bot.on('ready', () => {
  console.log(`Logged in as ${bot.user.username}!`);
});

bot.on('message', msg => {
  if (msg.content === '!ping') {
    msg.reply('Pong!');
  }
});

bot.on('message', msg => {
  if (msg.content === '!roll') {
    msg.reply(Roll());
  }
});

bot.on('message', msg => {
  if (msg.content === '!imgur') {
  msg.reply(Imgur());
  }
});

bot.login('MjkzNDE3MDc0MzUxNDA3MTA0.C7GRmQ.Iw0J5M_RCwFZ9FMyIXGjvK6izJo');

function Roll() {
  x = Math.ceil(Math.random()*6);
  return x;
}

function FivetoSeven() {
  x = Math.floor(Math.random()*2)+5;
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
  for (var i = 0, z = '', y, x, fivetoseven = FivetoSeven(); i <= fivetoseven; i++) {
    x = Math.round(Math.random()*3);
    if (x < 1) {
      y = Upper();
    }
    if (x >= 1 && x <= 2) {
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
function ImgurChecker() {
  x = Imgur();

}
/*
test both .jpg and .mp4 endings.
the link will fail if the regexp finds the link became https://imgur.com/gallery/...
If one of them works, post the message.
Else retry.

Daily whale fact
*/
