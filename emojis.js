const discord = require("discord.js");

var emojis = module.exports;

const fs = require('fs');
var forsale = [];

emojis.readJSON = function(callback) {
  fs.readFile('./emoji.json', 'utf-8', (err, data) => {
    if (err) throw err;
    var parsedata = JSON.parse(data);
    return callback(parsedata);
  });
}
emojis.storeRegen = function(callback) {
  var t = new Date();
  var time = parseInt(t.getTime());
  fs.readFile('./emojistore.json', 'utf-8', (err, data) => {
    if (err) throw err;

    var parsestore = JSON.parse(data);
    if (time >= parsestore.resetTime + 3600000) {
      parsestore.resetTime = time;
      emojis.readJSON(function(callback) {
        for (i = 0; i < 5; i++) {
          var x = Math.ceil(Math.random() * 50);
          //console.log(x);
          var cat;
          if (x < 15) {
            cat = "Low_Grade";
          }
          else if (x >= 15 && x < 25) {
            cat = "Mid_Grade";
          }
          else if (x >= 25 && x < 35) {
            cat = "High_Grade";
          }
          else if (x >= 35 && x < 42) {
            cat = "Epic";
          }
          else if (x >= 42 && x < 47) {
            cat = "Legendary";
          }
          else {
            cat = "God_Tier";
          }
          var emojiobj = callback[cat];
          var emojiarrnum = Math.floor(Math.random() * emojiobj.length);
          if (forsale.indexOf(emojiobj[emojiarrnum]) == -1) {  // Searches the forsale array for any duplicates. If there are none, then execute this if statement.
            forsale[i] = emojiobj[emojiarrnum];
          }
          else {
            i--;
          }
        }
        parsestore.forSale = forsale;
        fs.writeFile('./emojistore.json', JSON.stringify(parsestore, null, 2), (err) => {
          if (err) {
            return console.log(err);
          }
        });
      })
    }
    else {
      if (callback != null) {
        return callback(parsestore.forSale);
      }
    }
  });
}
