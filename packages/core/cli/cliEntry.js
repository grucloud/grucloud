#!/usr/bin/env node
const log = require("why-is-node-running"); // should be your first require

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
  onExit: async ({ code }) => {
    logger.info(`onExit ${code}`);
    await new Promise((resolve, reject) => {
      logger.logger.on("finish", function () {
        //console.log("why-is-node-running:");
        //log();
        process.exit(code);
      });
      logger.logger.end();
    });
  },
});
