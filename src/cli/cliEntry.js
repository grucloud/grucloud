#!/usr/bin/env node
const pkg = require("../../package.json");
const { createProgram } = require("./program");
const commands = require("./cliCommands");

const program = createProgram({
  version: pkg.version,
  argv: process.argv,
  commands,
});

console.log(`GruCloud ${program._version}`);

program
  .parseAsync(process.argv)
  .then(() => {
    //console.log("Done");
  })
  .catch((error) => {
    //console.log("Error ", JSON.stringify(error, null, 4));
  });
