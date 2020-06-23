#!/usr/bin/env node
const { main } = require("./cliMain");
main({
  argv: process.argv,
  onExit: ({ code }) => process.exit(code),
});
