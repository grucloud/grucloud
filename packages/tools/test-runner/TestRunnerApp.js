#!/usr/bin/env node
const assert = require("assert");
const { pipe, tap } = require("rubico");
const path = require("path");
const { Command } = require("commander");

const { walkDirectory } = require("./WalkDirectory");
const { testRunner, environments } = require("./TestRunner");

const createProgram = ({ version }) => {
  const program = new Command();
  program.storeOptionsAsProperties(false);
  program.allowUnknownOption(); // For testing
  program.version(version);
  program.option("-i, --input <file>", "input directory", process.cwd());
  program.option("-c, --command <string>", "command", "gc plan");

  program.parse(process.argv);

  return program;
};

const main = (options) =>
  pipe([
    tap(() => {
      assert(options);
      assert(options.input);
      assert(options.command);
    }),
    () => path.resolve(options.input),
    walkDirectory({}),
    tap((directory) => {
      assert(directory);
    }),
    testRunner({
      command: options.command,
      environments,
    }),
  ])();

const program = createProgram({ version: "1.0" });
const options = program.opts();

main(options)
  .then(() => {
    console.log("done");
  })
  .catch((error) => {
    console.error("error");
    console.error(error);
    throw error;
  });
