#!/usr/bin/env node
const { Command } = require("commander");
const { main } = require("./OpenStack2Gcp");

const createProgram = ({ version }) => {
  const program = new Command();
  program.storeOptionsAsProperties(false);
  program.allowUnknownOption(); // For testing
  program.version(version);
  program.requiredOption("-i, --input <file>", "lives resources");
  program.option("-o, --output <file>", "iac.js output", "iac.js");
  program.option("-m, --mapping <file>", "mapping file", "mapping.json");

  program.parse(process.argv);

  return program;
};

//TODO read version from package.json
const program = createProgram({ version: "1.0" });
const options = program.opts();

main(options)
  .then(() => {})
  .catch((error) => {
    console.error("error");
    console.error(error);
    throw error;
  });
