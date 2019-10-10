var encoder = module.exports;

encoder.caesar = function(str, shift) {
  var encoded = [];
  for (i = 0; i < str.length; i++) {
    if (str.charCodeAt(i) >= 65 && str.charCodeAt(i) <= 90) { // If the letter is Uppercase
      var num = (((str.charCodeAt(i) + parseInt(shift)) + 13) % 26) + 65;
      encoded[i] = String.fromCharCode(num);
    }
    else if (str.charCodeAt(i) >= 97 && str.charCodeAt(i) <= 122) { // If the letter is Lowercase
      var num = ((((str.charCodeAt(i) + parseInt(shift)) + 7) % 26) + 97);
      encoded[i] = String.fromCharCode(num);
    }
    else {
      encoded[i] = str[i];
    }
  }
  console.log("(Cryptography) Caesar's Cipher has been utilized!");
  return encoded.join('');
}

encoder.binary = function(str, callback) {
  var encoded = [];
  var asciinum;
  var rawio;
  var properio;
  for (i = 0; i < str.length; i++) {
    asciinum = str.charCodeAt(i);
    rawio = (asciinum >>> 0).toString(2);
    properio = rawio;
    while (properio.length < 8) {
      properio = "0" + properio;
    }
      encoded[i] = properio;
  }
  console.log("(Cryptography) Binary has been utilized!");
  return callback(encoded.join(''));
}

encoder.binarydecode = function(str, callback) {
  var decoded = [];
  var ascii;
  for (i = 1, len = str.length / 8; i <= len; i++) {
    decoded[i] = str.substr((i * 8) - 8, 8);
  }
  for (i = 0, arrlen = decoded.length, k = 7; i < arrlen; i++) {
    if (parseInt(decoded[i], 2).toString(10) == NaN) {
      decoded[i] = substr(1, k);
      k--;
      i--;
    }
    else {
      k = 7;
      ascii = parseInt(decoded[i], 2).toString(10);
      decoded[i] = String.fromCharCode(ascii);
    }
  }
  console.log("(Cryptography) Binary has been utilized!");
  return callback(decoded.join(''));
}

var morsecode = ["._","_...","_._.","_..",".",".._.","__.","....","..",
".___","_._","._..","__","_.","___",".__.","__._","._.","...","_",
".._","..._",".__","_.._","_.__","__.."]; // a-z

var morsecodenum = ["_____",".____","..___","...__","...._",".....","_....",
"__...","___..","____."]; // 0-9

encoder.morseencode = function(str) {
  safestr_1 = str.toLowerCase(); // First step in preparing the string for conversion is to make everything lowercase
  safestr_2 = safestr_1.replace(/([^a-z0-9\,\.\ ]+)/g, '');
  encoded = '';

  for (i = 0; i < safestr_2.length; i++) {
    asciipos = safestr_2.charCodeAt(i) - 97;

    if (asciipos == -53) {
    	encoded += '__..__ ';
    }
    else if (asciipos == -51) {
    	encoded += '._._._ ';
    }
    else if (asciipos == -65) {
    	encoded += '   ';
    }
    else if (asciipos >= -49 && asciipos <= -40) {
      asciipos = safestr_2.charCodeAt(i) - 48;
      encoded += morsecodenum[asciipos] + ' ';
    }
    else {
    	encoded += morsecode[asciipos] + ' ';
    }
  }
  return encoded;
}

encoder.morsedecode = function(str) {
  safestr_1 = str.toLowerCase().replace(/([^\.\_\ ]+)/g, '');
  safestr_2 = str.replace(/^\ /g, '');
  morsearr = safestr_2.split(/[ ]/g);
  console.log(morsearr);
  var decoded = [];

  for (i = 0; i < morsearr.length; i++) {   // This loop will loop through each morse letter.
    for (k = 0; k < morsecode.length + 2; k++) { // This loop will compare the current morse letter with everything in the morsecode array.
      if (k >= morsecode.length) {
        if (morsearr[i] === '__..__') {
          decoded[i] = ',';
        }
        else if (morsearr[i] === '._._._') {
          decoded[i] = '.';
        }
        else {
          decoded[i] = '';
        }
      }
      else if (morsearr[i] === morsecode[k]) {
          decoded[i] = String.fromCharCode(k + 97);
          k = morsecode.length + 3;
      }
    }
    //console.log(decoded[i]);
  }
  decoded = decoded.toString().replace(/[,]{4}/g,' ');
  decoded = decoded.replace(/,/g, '');
  return decoded;

  /*for (i = 0; i < 30; i++) {
    if (i == 26) {
      decoded = safestr_2.replace('__..__',',');
    }
    else if (i == 27) {
      decoded = safestr_2.replace('._._._','.');
    }
    else if (i == 28) {
      decoded = safestr.replace(/\ (?=\S)/g,'');
    }
    else if (i == 29) {
      decoded = safestr.replace(/\ (?=\S)/g,'');
    }
    else {
      decoded = safestr.replace(morsecode[i],String.fromCharCode(i + 97)); //decoded.replace(/^\S+/g,String.fromCharCode(i + 97));
      console.log(decoded);
    }*/
}

/*I: Get user string.
II: Encode with caesar
  i: Take the string and get its length.
  ii: Make a for loop that iterates until i reaches the strings length.
    1: Take the letter at this iteration and check if it is upper or lowercase.
    2: Shift the letter up or down relative to where it is on the ascii table so long as it falls within the Uppercase range (65 - 90) or the Lowercase range (97 - 122)
    IGNORE ANY OTHER INPUTS.
    3: Once that letter is shifted, check if it's between an upper or lower case range.
    4: Move it to the encoded array.
III: Send the main file the encoded array.*/
