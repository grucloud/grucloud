#!/usr/bin/env node
const logger = require("../logger")({ prefix: "CliEntry" });

process.on("unhandledRejection", (reason, p) => {
  console.log("Unhandled Rejection at: Promise", p, "reason:", reason);
});

process.on("exit", function (code) {
  //console.log("grucloud exit", code);
});

const { main } = require("./cliMain");
main({
  argv: process.argv,
  onExit: async ({ code }) => {
    logger.info(`onExit ${code}`);

    setTimeout(() => logger.logger.end(), 100);

    await new Promise(() => {
      logger.logger.on("finish", function () {
        process.exit(code);
      });
    });
  },
});
