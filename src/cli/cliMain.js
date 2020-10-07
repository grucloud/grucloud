#!/usr/bin/env node
require("dotenv").config();
const Duration = require("duration");
const pkg = require("../../package.json");
const { createProgram } = require("./program");
const commands = require("./cliCommands");
const logger = require("../logger")({ prefix: "CliMain" });

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
    if (!["output"].includes(commmand.args[0])) {
      console.log(
        `Command "${executableName} ${commmand.args.join(
          " "
        )}" executed in ${duration.toString(1, 1)}`
      );
    }
    return 0;
  } catch (error) {
    const { code = -1 } = error;
    logger.error(error.message);
    error.message && console.error(`Error: ${error.message}`);
    error.stack && console.log(error.stack);
    onExit({ code, error });
    return code;
  }
};
