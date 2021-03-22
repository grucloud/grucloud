#!/usr/bin/env node
const logger = require("../logger")({ prefix: "CliEntry" });

process.on("unhandledRejection", (reason, p) => {
  console.log("Unhandled Rejection at: Promise", p, "reason:", reason);
});

process.on("exit", function () {
  //console.log("grucloud exit");
});

const { main } = require("./cliMain");
main({
  argv: process.argv,
  onExit: ({ code }) => {
    logger.info(`onExit ${code}`);
    logger.logger.on("finish", function () {
      process.exit(code);
    });
  },
});
