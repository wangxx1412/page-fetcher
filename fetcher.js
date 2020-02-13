const request = require("request");
const fs = require("fs");
const isValid = require("is-valid-path");

const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const url = process.argv[2];
const savePath = process.argv[3];

const getFilesizeInBytes = filename => {
  return fs.statSync(filename)["size"];
};

if (isValid(savePath)) {
  request(url, (error, response, body) => {
    if (error) {
      console.log(error);
      console.log("App terminated.");
      process.exit();
    }
    if (response.statusCode !== 200) {
      console.log(
        `Error:${response.statusCode}, sorry, there is something wrong.`
      );
      console.log("App terminated.");
      process.exit();
    }

    //also fs.access()
    if (fs.existsSync(savePath)) {
      rl.question(
        "File already exists, do you want to overwrite it? Enter y to confirm, other keys to skip.",
        answer => {
          if (answer === "y") {
            fs.writeFile(savePath, body, err => {
              if (err) throw err;
              const size = getFilesizeInBytes(savePath);
              console.log(`Downloaded and saved ${size} bytes to ${savePath}`);
              process.exit();
            });
          } else {
            process.exit();
          }
        }
      );
    } else {
      fs.writeFile(savePath, body, err => {
        if (err) throw err;
        const size = getFilesizeInBytes(savePath);
        console.log(`Downloaded and saved ${size} bytes to ${savePath}`);
        process.exit();
      });
    }
  });
} else {
  console.log("The path typed is Invalid, please fix it.");
  process.exit();
}
