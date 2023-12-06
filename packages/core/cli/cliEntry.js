#!/usr/bin/env node
const logger = require("../logger")({ prefix: "CliEntry" });

process.on("unhandledRejection", (reason, p) => {
  console.log("Unhandled Rejection at: Promise", p, "reason:", reason);
});

process.on("uncaughtException", function (err) {
  console.error("uncaughtException");
  console.error(err.stack);
});

process.on("exit", function (code) {
  //console.log("grucloud exit", code);
});

const { main } = require("./cliMain");
main({
  argv: process.argv,
  onExit: async ({ code }) => {
    logger.debug(`onExit ${code}`);

    setTimeout(() => {
      try {
        logger.logger.end();
      } catch (error) {
        console.error("error in logger.end()");
      }
    }, 1000);

    await new Promise(() => {
      logger.logger.on("finish", function () {
        process.exit(code);
      });
    });
  },
});
