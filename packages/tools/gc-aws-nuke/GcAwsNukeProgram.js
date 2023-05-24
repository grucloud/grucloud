#!/usr/bin/env node
const assert = require("assert");
const { pipe, tap } = require("rubico");
const { Command } = require("commander");

exports.createProgram = ({ version = "1.0.test", argv }) => {
  assert(argv);

  const program = new Command();
  program.storeOptionsAsProperties(false);
  program.allowUnknownOption(); // For testing
  program.version(version);
  //program.option("-c, --config <file>", "config file", "gc-aws-nuke.config.js");
  program.option("-p, --profile <string>", "the AWS profile", "default");
  program.option(
    "-r, --regions <string...>",
    "regions, for instance us-east-1"
  );

  program.parse(argv);

  return program;
};
