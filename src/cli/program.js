#!/usr/bin/env node
const { Command } = require("commander");

exports.createProgram = ({ version, argv }) => {
  console.log(argv);
  const program = new Command();
  program.version(version).option("-l, --list", "list live resources");
  program.parse(argv);
  return program;
};
