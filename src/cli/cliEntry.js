#!/usr/bin/env node
const pkg = require("../../package.json");
const { createProgram } = require("./program");
const commands = require("./cliCommands");

const program = createProgram({
  version: pkg.version,
  argv: process.argv,
  commands,
});

//console.log(`GruCloud ${program._version}`);

program.parseAsync(process.argv).catch((error) => {
  const { code } = error;
  if (code === 422) {
    console.log(error.message);
    process.exit(22);
  } else {
    console.log(error);
    process.exit(-1);
  }
});
