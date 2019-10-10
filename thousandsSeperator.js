var seperator = module.exports;

seperator.thousands = function(num) {                                               // This function turns a number from this (1234567) to this (1,234,567). However, it returns a string, not a number.
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
      arrayofsplits[i] = inputnum.substr(k, 3) + ",";                               // If the length modulus 0 returns 0, then this else statement handles grouping the rest of the number by comma.
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
  return arrprint;
}
