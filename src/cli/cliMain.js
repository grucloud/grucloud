#!/usr/bin/env node
require("dotenv").config();
const pkg = require("../../package.json");
const { createProgram } = require("./program");
const commands = require("./cliCommands");
const logger = require("../logger")({ prefix: "AwsClientEC2" });

exports.main = ({ argv, onExit }) => {
  const program = createProgram({
    version: pkg.version,
    argv,
    commands,
  });

  logger.info(`GruCloud ${pkg.version}`);
  logger.info(new Date().toUTCString());

  logger.info(`argv: ${argv}`);
  const { stage } = process.env;
  logger.info(`stage: ${stage}`);

  return program.parseAsync(argv).catch((error) => {
    const { code } = error;
    if (code === 422) {
      logger.error(error.message);
      onExit({ code: 422, error });
    } else {
      console.log(error.stack);
      console.log(error);
      onExit({ code: -1 });
    }
  });
};
