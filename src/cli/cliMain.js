#!/usr/bin/env node
require("dotenv").config();
const Duration = require("duration");
const pkg = require("../../package.json");
const { createProgram } = require("./program");
const commands = require("./cliCommands");
const logger = require("../logger")({ prefix: "AwsClientEC2" });

const executableName = "gc";

exports.main = async ({ argv, onExit }) => {
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
  try {
    const startDate = new Date();
    const commmand = await program.parseAsync(argv);
    const duration = new Duration(startDate, new Date());
    console.log(
      `Command "${executableName} ${commmand.args.join(
        " "
      )}" executed in ${duration.toString(1, 1)}`
    );
  } catch (error) {
    const { code } = error;
    if ([400, 422].includes(code)) {
      logger.error(error.message);
      console.error(`Error: ${error.message}`);
      onExit({ code, error });
    } else {
      error.stack && console.log(error.stack);
      console.log(error);
      onExit({ code: -1 });
    }
  }
};
