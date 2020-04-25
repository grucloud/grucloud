#!/usr/bin/env node
const pkg = require("../../package.json");
const { createProgram } = require("./program");
const { main } = require("./cli");

const program = createProgram({ version: pkg.version, argv: process.argv });

main({ program })
  .then(() => {
    //console.log("Done");
  })
  .catch((error) => {
    console.log("Error ", JSON.stringify(error, null, 4));
  });
