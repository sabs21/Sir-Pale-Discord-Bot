const https = require('https');
var imgur = module.exports;
/* ImageArray will hold a max of 10 image url's at one time.
Once it gets down to 3 images or lower, it starts to refill.*/
var ImageArray = [];
var url = "https://imgur.com/";

imgur.getImage = function(callback) {
    console.log(ImageArray);
    arrayFiller();
    callback(imageFetcher());
}

function imageFetcher() {
  if (ImageArray.length > 0) {
    return ImageArray.shift();
  }
  else {
    return "https://liveacappella.com/views/site/images/global/icons/loading.gif";
  }
}

function arrayFiller() {
  // This if statement finds out if there are 2 or less images in ImageArray.
  if (ImageArray.length <= 2) {
    // This for loop should refill ImageArray with 10 valid images.
    for (var i = ImageArray.length; i <= 50; i++) {
      // testurl retrieves a url.
      var testurl = linkGenerator(url, imageTester);
      // These if statements test if the url is valid (true) or not (false).
      if (testurl === false) {
        i--;
      }
      else if (testurl === true) {
        console.log("4 arrayFiller: testurl = True.");
      }
    }
  }
}

function arrayHandler(request) {
    if (request !== false) {
      // Add requested url to ImageArray
      ImageArray.push(request);
      return true;
      }
    else {
      return false;
    }
}

function imageTester(requesturl, callback) {
  // This requests the page supplied by linkGenerator.
  https.get(requesturl, (res) => {

    let error;

    if (res.statusCode === 200) {
      /* If it does work, have the callback receive the tested url.
         The callback function will be arrayHandler */
      callback(requesturl);
    }
    else {
      error = new Error('Request Failed');
      /* If it doesn't work, have the callback receive false.
         The callback function will be arrayHandler */
      callback(false);
    }
  })
}

function linkGenerator(baseurl, callback) {
  // strlen governs how many loops the for loop will do.
  //var strlen = Math.ceil(Math.random()*3)+4; // This version of strlen scans the whole imgur spectrum (SLOWER)
  var strlen = 5; // This version of strlen scans a smaller imgur spectrum (FASTER)
  // urlstr is the base url at first, but after the for loop completes, it is the full url.
  var urlstr = baseurl;
  // Each iteration of this loop will generate a character to add to the final string (urlstr).
  for (i = 0; i < strlen; i++) {
    // chartype will help decide if the next character will be uppercase, lowercase, or a digit.
    var chartype = Math.random();
    // char will be the generated character after one iteration.
    var char;

    // This if statement decides if the next character will be uppercase, lowercase, or a digit.
    if (chartype < .334) {
      // This is an uppercase letter.
      char = Math.floor(Math.random()*26)+65;
    }
    else if (chartype >= .334 && chartype < .667) {
      // This is a lowercase letter.
      char = Math.floor(Math.random()*26)+65;
    }
    else {
      // This is a digit.
      char = Math.floor(Math.random()*10)+48;
    }
    // This turns the char variable into a proper character and adds it to urlstr.
    urlstr += String.fromCharCode(char);
  }
  console.log("Link generated: " + urlstr);
  // The callback function will be imageTester.
  callback(urlstr, arrayHandler);
}

/*I) Check the ImageArray
  1) Check if ImageArray.length > 0 images.
    1.1) Then have the bot post the next image.
    1.2) Then shift() that image out of the ImageArray.
  2) Check if ImageArray <= 3 images.
    2.1) Then run a for loop that unshifts 10 valid images into ImageArray. Conditions: i = ImageArray.length; i < 10; i++
      2.11) Call II
      2.12) Then call III with the result of calling II.
      2.13) if the call doesnt callback a valid URL this iteration
        2.131) Then i--
        2.132) else unshift(result)

II) Get the imgur link.
  1) Generate a random string of 5 to 7 characters.
    1.1) Randomly pick a range between 5 to 7.
    1.2) Use this range in a for loop to govern how many times the for loop iterates. (i < range)
      1.21) For each iteration, randomly pick between returning a random uppercase, lowercase, or digit.
  2) Concatenate Imgurs base url to the string of 5 to 7 characters. (https://imgur.com/ + "jGR5iKw")

III) Verify that the link works.
  1) Using the request module, get the links statuscode.
    1.1) If the statuscode is equal to 200, then it works.
    1.2) Else the link is not valid (return -1)
      1.21) call to II)
*/
