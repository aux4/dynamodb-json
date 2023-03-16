#!/usr/bin/env node

process.stdin.setEncoding("utf8");

const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");

const args = process.argv.splice(2);

(async () => {
  const inputString = await readStdIn();

  let input;

  try {
    input = JSON.parse(inputString);
  } catch (e) {
    console.error("Invalid JSON input");
    process.exit(1);
  }

  if (args[0] === "marshall") {
    printJson(marshall(input));
  } else {
    printJson(unmarshall(input));
  }
})();

function printJson(object) {
  console.log(JSON.stringify(object, null, 2));
}

function readStdIn() {
  return new Promise((resolve) => {
    let inputString = "";

    stdin = process.openStdin();

    stdin.on("data", function (data) {
      inputString += data;
    });

    stdin.on("end", function () {
      resolve(inputString);
    });
  });
}
