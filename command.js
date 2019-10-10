const discord = require("discord.js");
const bot = new discord.Client();
const http = require('http');
const request = require('request');
const cheerio = require('cheerio');
const express = require('express');
var exports = module.exports = {};

/* This file is dedicated to shortening the commands section of the main.js file.
It may replace some functions, but the file for shortening functions does more
function replacements. Refer to functionassist.js */

exports.help = function() {
    return "\n    :panda_face: _***Fun Stuff***_ :panda_face:\n  !imgur    *Finds a random Imgur image.*\n  !ifunny    *Finds a random Ifunny image.*\n  !slots    *Play a game of slots. ('!slots score' to see point system)*\n  !bal    *Check your credit balance.*\n  !crate    *Open an hourly crate.*\n  !emoji    *View your collection of emoji!*\n\n    :moneybag: _***Markets***_ :moneybag:\n  !crypto    *Find the price of a cryptocurrency!*\n  !shop    *Buy emoji's with your hard earned greens!*\n\n    :closed_lock_with_key: _***Cryptography/Security***_ :closed_lock_with_key:\n  !encode     *Encrypt a message!*\n  !decode     *Decrypt a message!*\n  !password    *Generate a random password.*\n\n    :wrench: _***Utility***_ :wrench:\n  !roll    *Roll a die or two!*\n  !define    *Define an english word.*\n  !uptime    *Check how long the bot has been running for.*\n  !notify    *Reduce server spam by being DM'd every x amount of messages. Be sure to turn off server notifications!*";
};

exports.roll = function(a, b) {
  if (b == undefined) {
    b = 6;
  }
  else if (b > 1000000) {
    b = 1000000;
  }
  else if (b < 0 || b == NaN) {
    b = 1;
  }
  if (a > 100) {
    a = 100;
  }
  else if (a < 0 || a == NaN) {
    return "Proper syntax for roll command: !roll [Number of dice to roll] [How many faces does the dice have?] (The default amount of faces is 6)";
  }
  y = 0;
  for (i = 1; i <= a; i++) {
    if (i == a) {
      x = Math.ceil(Math.random()*b);
      y = y + x + ".";
    }
    else if (i == a - 1) {
      x = Math.ceil(Math.random()*b);
      y = y + x + "** and **"
    }
    else {
      x = Math.ceil(Math.random()*b);
      y = y + x + "**, **";
    }
  }
  return "You've rolled a **" + y + "**";
}

exports.rollhelp = function() {
  return "Proper syntax for roll command: !roll [Number of dice to roll. Limit: 100] [How many faces does the dice have? Limit: 1,000,000. The default amount of faces is 6]";
}

exports.uptime = function(uptime) {
  var x = uptime % 60;
  var y = Math.floor(uptime / 60);
  var z = Math.floor((uptime / 60)/60);
  if (uptime < 60) {
    return "This bot has been running for " + x + " seconds.";
  }
  else if (uptime >= 60 && uptime < 3600) {
    return "This bot has been running for " + (y % 60) + " minutes and " + x + " seconds.";
  }
  else {
    return "This bot has been running for " + z + " hours, " + (y % 60) + " minutes and " + x + " seconds.";
  }
}

exports.ifunny = function(callback) {
  var url = 'https://ifunny.co/feeds/shuffle';
  request(url, function(error, response, html) {
    if (error) {
      return console.log("(ifunny) Problem!");
    }
    else {
      var $ = cheerio.load(html);
      var img = $('img').eq(13).attr('data-src');
      if (img.search("_3.jpg") != -1) {
        img = img.replace("https://imageproxy.ifcdn.com/noop/images/", "https://img.ifcdn.com/images/");
        img = img.replace("3.jpg","1.gif");
      }
      console.log('(Ifunny) ' + img);
      return callback(img);
    }
  })
}

exports.define = function(word, callback) {
  var url = "https://www.vocabulary.com/dictionary/" + word;
    request(url, function(error, response, html) {
      if (error) {
        return console.log("(Define) Problem!")
      }
      else {
        function Uppercase(a) {
          return a.charAt(0).toUpperCase() + a.slice(1);
        }
        var $ = cheerio.load(html);
        var defsearch1 = $('p.short').eq(0).text();
        var defsearch2 = $('h3.definition').eq(0).text();
        if (defsearch1 == "" || defsearch1 == undefined) {
          if (defsearch2 != "" || defsearch2 != undefined) {
            $('a').remove();
            var def = defsearch2.replace(/(\s{2,3})+/g, "");
          }
          else {
            $('a').remove();
            var rawdef = $('dd').eq(0).text();
            var rawdef2 = rawdef.replace(", ,", "");
            var def = Uppercase(rawdef2.replace(/(\s+)/, ""));
          }
        }
        else {
          var def = defsearch1;
        }
        //var defined = "   :small_orange_diamond:    " + def;                    //This here is purely for good cosmetics in chat.
        var reply = "\n              **Definition of " + Uppercase(word.replace("%20", " ")) + "**\n" + "   :small_orange_diamond:    " + def;
        console.log("(Define) Defined the word: " + word.replace("%20", " "));
        callback(reply);
      }
    })
}

exports.definehelp = function() {
  return "This command searches vocabulary.com for its definitions. Proper syntax for define command: !define [english word]";
}

exports.slotsbetcheck = function(initialbet) {
  if (initialbet == undefined) {
    return userbet = 1;
  }
  else if (initialbet.search(/[0-9]/) == -1) {
    initialbet.replace(/[A-z]/, "");
    return userbet = 0;
  }
  else if (initialbet.search(/[0-9]/) > 0) {
    parseInt(initialbet.replace(/[^0-9]/g, ""));
    return userbet = Math.round(Math.abs(initialbet));
  }
  else {
    return userbet = Math.round(Math.abs(initialbet));
  }
}

exports.cryptoinfo = function(coin, callback) {
  var url = "https://api.coinmarketcap.com/v1/ticker/" + coin + "/";
  //var url = "https://api.coinmarketcap.com/v1/ticker/bitcoin/";
  request(url, function(error, response, html) {
    if (error) {
      console.log("(Crypto) Problem!");
    }
    else {
      var htmlfix = html.replace(/[\]\[]/g, "").toString();
      var cryptojson = JSON.parse(htmlfix);
      var getdate = new Date();
      var time = (parseInt(getdate.getTime())) / 1000;
      var lastupdate = (time.toFixed(0) - cryptojson.last_updated);
      var timemeasure = " seconds";
      var percentvalues = [cryptojson.percent_change_1h, cryptojson.percent_change_24h, cryptojson.percent_change_7d];
      var hourdayweek = [];
      if ((lastupdate > 59 && lastupdate < 120)) {
        timemeasure = " minute";
        lastupdate = Math.floor(lastupdate / 60);
      }
      else if (lastupdate >= 120) {
        timemeasure = " minutes";
        lastupdate = Math.floor(lastupdate / 60);
      }
      for (i = 0; i < 3; i++) {
        if (percentvalues[i] < 0) {
          hourdayweek[i] = ":red_circle:";
        }
        else {
          hourdayweek[i] = ":large_blue_circle:";
        }
      }
      var cryptomessage = "\n **" + cryptojson.name + "** (" + cryptojson.symbol + "):       Current Price: " + cryptojson.price_usd + " USD\n                    " + hourdayweek[0] + "        1h: " + cryptojson.percent_change_1h + " %\n                    " + hourdayweek[1] + "        24h: " + cryptojson.percent_change_24h + " %\n                    " + hourdayweek[2] + "        7d: " + cryptojson.percent_change_7d + " %\n                                   Last Updated: " + lastupdate + timemeasure + " ago.";
      return callback(cryptomessage);
    }
  })
}

exports.password = function(len, adv) {
  var randnum;
  var passarr = [];
  if (adv === "adv") {
    for (i = 0; len > i; i++) {
      randnum = Math.ceil(Math.random() * 93) + 31;
      passarr[i] = String.fromCharCode(randnum);
    }
  }
  else {
    for (i = 0; len > i; i++) {
      var charpick = Math.ceil(Math.random() * 3);
      if (charpick === 1) {
        randnum = Math.ceil(Math.random() * 10) + 47;
        passarr[i] = String.fromCharCode(randnum);
      }
      else if (charpick === 2) {
        randnum = Math.ceil(Math.random() * 26) + 64;
        passarr[i] = String.fromCharCode(randnum);
      }
      else {
        randnum = Math.ceil(Math.random() * 26) + 96;
        passarr[i] = String.fromCharCode(randnum);
      }
    }
  }
  console.log("(Password) A password has been generated!")
  return passarr.join('');
}

/*exports.readablenum = function(num, callback) {                                   // This function turns a number from this (1234567) to this (1,234,567). However, it returns a string, not a number.
  var negcheck = (num).toString();                                                  // This variable is used to check if the input number is a negative in a later if statement.
  var inputnum = Math.abs((num)).toString();                                        // This is the number that will be run through the loop. This uses the number's absolute value in order to to avoid unforeseen scenarios in the loop's if statements.
  var arrayofsplits = [];                                                           // Each set of three numbers in the input number will be stored into this array.
  var arrprint = "";                                                                // This will be what's returned at the end of all of this.
  for (i = 0, len = inputnum.length, looplen = Math.floor(inputnum.length / 3), k = 0 + (len % 3); i <= looplen; i++) { // i will define each array item. len will shrink by 3 with each iteration of the loop. looplen dictates how many iterations are in the loop, but if the number is less than 1000, it is inaccurate.
    if (len <= 3 && i == 0) {                                                       // This handles a number that's less than 1000.
      looplen = 0;                                                                  // Setting this to zero shuts down the loop.
      arrayofsplits[i] = inputnum.substr(0, len);
    }
    else if (len <= 3) {                                                            // This handles the last 3 numbers to any number greater than or equal to 1000.
      looplen = 0;                                                                  // Setting this to zero shuts down the loop.
      arrayofsplits[i] = inputnum.substr(k, len);
    }
    else if (len == inputnum.length && (len % 3) != 0) {                            // On the first loop, if the length of the number doesn't divide evenly by 3, subtract len by len modulus 3
      arrayofsplits[i] = inputnum.substr(0, len % 3) + ",";                         // in order to avoid any unforeseen scenarios for the other if statements.
      len -= (len % 3);
    }
    else {
      arrayofsplits[i] = inputnum.substr(k, 3) + ",";
      k += 3;
      len -= 3;
    }
    arrprint += arrayofsplits[i];                                                   // This forms the string that will be displayed at the end.
  }
  if (negcheck.search("-") != -1) {                                                 // This checks if the number was originally a negative number.
    arrprint = "-" + arrprint.toString();                                           // If so, this adds the negative symbol to the front of it and ensures that arrprint is a string.
  }
  else {
    arrprint = arrprint.toString();                                                 // If not, this just assures that arrprint is a string.
  }
  callback(arrprint);
}*/

exports.test = function(word) {
  return word;
};
