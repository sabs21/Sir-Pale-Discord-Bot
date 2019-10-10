var slots = module.exports;
var seperator = require('./thousandsSeperator.js');
var slotobj = {
  sloticon1 : {
    icon : ":bread:",
    value : 1
  },
  sloticon2 : {
    icon : ":custard:",
    value : 2
  },
  sloticon3 : {
    icon : ":milk:",
    value : 3
  },
  sloticon4 : {
    icon : ":pizza:",
    value : 5
  },
  sloticon5 : {
    icon : ":banana:",
    value : 7
  },
  sloticon6 : {
    icon : ":taco:",
    value : 10
  },
  sloticon7 : {
    icon : ":chocolate_bar:",
    value : 15
  },
  sloticon8 : {
    icon : ":candy:",
    value : 30
  }
}

slots.playSlots = function(bet, usercredits) {
  var slotchecker = slotsChecker(bet);
  if (slotchecker <= usercredits) {
    var slotarr = slotsGame();
    var slotreward = slotsReward(slotarr, slotchecker);
    console.log("(Slots) A game of slots has been played!");
    return [slotsDisplay(slotarr, slotchecker), slotreward];
  }
  else {
    return ["You can't afford that bet! You have $" + seperator.thousands(usercredits) + ".", 0];
  }
}

slots.help = function() {
  return "\n**2X SYMBOLS      |      3X SYMBOLS**\n:bread: = 1                        :bread: = 5\n:custard: = 2                       :custard: = 10\n:milk: = 3                       :milk: = 15\n:pizza: = 5                       :pizza: = 25\n:banana: = 7                      :banana: = 35\n:taco: = 10                       :taco: = 50\n:chocolate_bar: = 15                      :chocolate_bar: = 75\n:candy: = 30                      :candy: = 150\n";
}

function slotsChecker(bet) {                                                      // This checks the number given by the user and makes sure it is just a number.
  if (bet == undefined) {                                                         // This should remove letters, negatives (or any special character),
    return 1;                                                                     // round to whole numbers, and define an undefined input.
  }
  else if (bet.search(/[0-9]/) == -1) {
    bet.replace(/[A-z]/, "");
    return 0;
  }
  else if (bet.search(/[0-9]/) > 0) {
    parseInt(bet.replace(/[^0-9]/g, ""));
    return Math.round(Math.abs(bet));
  }
  else {
    return Math.round(Math.abs(bet));
  }
}

function slotsGame() {                                                            // This generates an array of random emoji icons used for the slot machine.
  var slotarr = [];
  var done = false;
  var j = 0;
  var k = 8;
  while (done == false) {                                                         // This will loop the for loop until there are no icons in the same column.
    for (i = j; i <= k; i++) {
      slotarr[i] = Math.ceil(Math.random()*100);
      if (slotarr[i] <= 30) {
        slotarr[i] = slotobj.sloticon1;
      }
      else if (slotarr[i] > 30 && slotarr[i] <= 50) {
        slotarr[i] = slotobj.sloticon2;
      }
      else if (slotarr[i] > 50 && slotarr[i] <= 65) {
        slotarr[i] = slotobj.sloticon3;
      }
      else if (slotarr[i] > 65 && slotarr[i] <= 77) {
        slotarr[i] = slotobj.sloticon4;
      }
      else if (slotarr[i] > 77 && slotarr[i] <= 85) {
        slotarr[i] = slotobj.sloticon5;
      }
      else if (slotarr[i] > 85 && slotarr[i] <= 92) {
        slotarr[i] = slotobj.sloticon6;
      }
      else if (slotarr[i] > 92 && slotarr[i] <= 97) {
        slotarr[i] = slotobj.sloticon7;
      }
      else if (slotarr[i] > 97 && slotarr[i] <= 100) {
        slotarr[i] = slotobj.sloticon8;
      }
      else {
        i--;
      }
    }
    if ((slotarr[0].value == slotarr[1].value) || (slotarr[0].value == slotarr[2].value) || (slotarr[1].value == slotarr[2].value)) {
      j = 0;
      k = 2;
    }
    else if ((slotarr[3].value == slotarr[4].value) || (slotarr[3].value == slotarr[5].value) || (slotarr[4].value == slotarr[5].value)) {
      j = 3;
      k = 5;
    }
    else if ((slotarr[6].value == slotarr[7].value) || (slotarr[6].value == slotarr[8].value) || (slotarr[7].value == slotarr[8].value)) {
      j = 6;
      k = 8;
    }
    else {
      done = true;
    }
  }
  return slotarr;
}

function slotsReward(slotarr, bet) {                                              // This will calculate the credit change number, this function can give out negatives or positives.
  if (slotarr[1].value == slotarr[4].value && slotarr[1].value == slotarr[7].value) {
    return ((slotarr[1].value * bet) * 5) - bet;
  }
  else if (slotarr[1].value == slotarr[4].value || slotarr[1].value == slotarr[7].value ) {
    return (slotarr[1].value * bet) - bet;
  }
  else if (slotarr[4].value == slotarr[7].value) {
    return (slotarr[4].value * bet) - bet;
  }
  else {
    return bet - (bet * 2);
  }
}

function slotsDisplay(slotarr, bet) {                                             // This displays all of the info gathered in a nice message format.
  var outcome = slotsReward(slotarr, bet);
  var outcomeComma = seperator.thousands(outcome);
  var result;
  if (outcome < 0) {
    result = "     Lost!    " + outcomeComma + " credits lost.";
  }
  else if (outcome == 0) {
    result = "     Even!    " + outcomeComma + " credits earned/lost.";
  }
  else {
    result = "**WINNER!**   +" + outcomeComma + " credits gained!       ";
  }
  var row1 = "\n\n            **─= SLOTS =─**\n      ════════════\n        [" + slotarr[0].icon + "] [" + slotarr[3].icon + "] [" + slotarr[6].icon + "]\n        ───────────\n";
  var row2 = "        [" + slotarr[1].icon + "] [" + slotarr[4].icon + "] [" + slotarr[7].icon + "] :small_orange_diamond:  " + result.substr(11) + "\n        ───────────\n";
  var row3 = "        [" + slotarr[2].icon + "] [" + slotarr[5].icon + "] [" + slotarr[8].icon + "]\n      ════════════\n                " + result.slice(0,12);
  var allrows = row1 + row2 + row3;
  return allrows;
}
