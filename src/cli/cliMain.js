#!/usr/bin/env node
require("dotenv").config();
const Duration = require("duration");
const pkg = require("../../package.json");
const { createProgram } = require("./program");
const commands = require("./cliCommands");
const logger = require("../logger")({ prefix: "CliMain" });
const { tos } = require("../tos");
const { convertError } = require("../providers/Common");
const executableName = "gc";
const YAML = require("./json2yaml");

exports.main = async ({ argv, onExit }) => {
  const program = createProgram({
    version: pkg.version,
    argv,
    commands,
  });

  logger.info(`GruCloud ${pkg.version}`);
  logger.info(new Date().toUTCString());

  logger.info(`argv: ${argv}`);
  const { STAGE } = process.env;
  logger.info(`stage: ${STAGE}`);
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
    onExit({ code: 0 });
    return 0;
  } catch (error) {
    const { code = -1 } = error;
    logger.error("main error:");
    //TODO
    //console.error(YAML.stringify(convertError({ error })));
    error.stack && console.log(error.stack);
    onExit({ code, error });
    return code;
  }
};
