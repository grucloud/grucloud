#!/usr/bin/env node
const { inspect } = require("node:util");
const { performance } = require("node:perf_hooks");
const pkg = require("../package.json");
const { createProgram } = require("./program");
const logger = require("../logger")({ prefix: "CliMain" });

exports.main = async ({ argv, onExit }) => {
  const program = createProgram();
  const argsStr = argv.join(" ");
  logger.info(`GruCloud ${pkg.version}`);
  logger.info(new Date().toUTCString());

  logger.info(`argv: ${argsStr}, pwd: ${process.cwd()}`);
  const { STAGE } = process.env;
  logger.info(`stage: ${STAGE}`);
  try {
    const startTime = performance.now();
    const commmand = await program.parseAsync(argv);
    const durationMs = performance.now() - startTime;
    const used = Math.ceil(process.memoryUsage().heapUsed / 1024 / 1024);
    if (!["output", "new", "gencode"].includes(commmand.args[0])) {
      console.log(`Executed in ${(durationMs / 1000).toFixed(2)}s, ${used} MB`);
    }
    await onExit({ code: 0 });
    return 0;
  } catch (error) {
    logger.info(`Error: ${inspect(error, { depth: 10 })}`);
    const code = 1;
    error?.stack && logger.error(error.stack);
    await onExit({ code, error });
    return code;
  }
};
