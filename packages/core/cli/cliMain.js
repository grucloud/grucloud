#!/usr/bin/env node
const { inspect } = require("node:util");
const Duration = require("duration");
const pkg = require("../package.json");
const { createProgram } = require("./program");
const logger = require("../logger")({ prefix: "CliMain" });
const executableName = "gc";
exports.main = async ({ argv, onExit }) => {
  const program = createProgram();
  const argsStr = argv.join(" ");
  logger.info(`GruCloud ${pkg.version}`);
  logger.info(new Date().toUTCString());

  logger.info(`argv: ${argsStr}, pwd: ${process.cwd()}`);
  const { STAGE } = process.env;
  logger.info(`stage: ${STAGE}`);
  try {
    const startDate = new Date();
    const commmand = await program.parseAsync(argv);
    const duration = new Duration(startDate, new Date());
    const used = Math.ceil(process.memoryUsage().heapUsed / 1024 / 1024);
    if (!["output", "new", "gencode"].includes(commmand.args[0])) {
      console.log(
        `Command "${executableName} ${argv
          .slice(2)
          .join(" ")}" executed in ${duration.toString(1, 1)}, ${used} MB`
      );
    }
    await onExit({ code: 0 });
    return 0;
  } catch (error) {
    logger.error(`Error: ${inspect(error, { depth: 10 })}`);
    const code = 1;
    error?.stack && logger.error(error.stack);
    await onExit({ code, error });
    return code;
  }
};
