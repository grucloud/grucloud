#!/usr/bin/env node

process.on("unhandledRejection", (reason, p) => {
  console.log("Unhandled Rejection at: Promise", p, "reason:", reason);
});

process.on("exit", function () {
  console.log("grucloud exit");
});

const { main } = require("./cliMain");
main({
  argv: process.argv,
  onExit: ({ code }) => process.exit(code),
});
