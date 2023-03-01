#!/usr/bin/env node
const Duration = require("duration");
const pkg = require("../package.json");
const { createProgram } = require("./program");
const logger = require("../logger")({ prefix: "CliMain" });
const executableName = "gc";

exports.main = async ({ argv, onExit }) => {
  const program = createProgram();

  logger.info(`GruCloud ${pkg.version}`);
  logger.info(new Date().toUTCString());

  logger.info(`argv: ${argv}`);
  const { STAGE } = process.env;
  logger.info(`stage: ${STAGE}`);
  try {
    const startDate = new Date();
    const commmand = await program.parseAsync(argv);
    const duration = new Duration(startDate, new Date());
    const used = Math.ceil(process.memoryUsage().heapUsed / 1024 / 1024);
    if (!["output", "new", "gencode"].includes(commmand.args[0])) {
      console.log(
        `Command "${executableName} ${commmand.args.join(
          " "
        )}" executed in ${duration.toString(1, 1)}, ${used} MB`
      );
    }
    await onExit({ code: 0 });
    return 0;
  } catch (error) {
    const { code = -1 } = error;
    logger.error("main error:");
    //TODO
    //console.error(YAML.stringify(convertError({ error })));
    error.stack && console.log(error.stack);
    await onExit({ code, error });
    return code;
  }
};
