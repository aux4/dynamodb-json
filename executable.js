#!/usr/bin/env node

process.stdin.setEncoding("utf8");

import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

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
    return;
  }

  if (input.Item) {
    input = input.Item;
  } else if (input.Items) {
    input = input.Items;
  }

  if (Array.isArray(input)) {
    printJson(input.map(item => unmarshall(item)));
  } else {
    printJson(unmarshall(input));
  }
})();

function printJson(object) {
  console.log(JSON.stringify(object));
}

function readStdIn() {
  return new Promise(resolve => {
    let inputString = "";

    const stdin = process.openStdin();

    stdin.on("data", function (data) {
      inputString += data;
    });

    stdin.on("end", function () {
      resolve(inputString);
    });
  });
}
