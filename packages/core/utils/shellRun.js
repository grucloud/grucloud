const assert = require("assert");
const { pipe, tap, get, eq, switchCase } = require("rubico");

const shell = require("shelljs");

const logger = require("./logger")({ prefix: "Common" });

exports.shellRun = (fullCommand) =>
  pipe([
    tap(() => {
      logger.debug(`shellRun: ${fullCommand}`);
    }),
    () =>
      shell.exec(fullCommand, {
        silent: true,
      }),
    switchCase([
      eq(get("code"), 0),
      get("stdout"),
      (result) => {
        throw {
          message: `command '${fullCommand}' failed`,
          ...result,
        };
      },
    ]),
  ])();
