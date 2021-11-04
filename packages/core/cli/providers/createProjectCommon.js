const assert = require("assert");
const { pipe, get, tap, switchCase, eq, tryCatch } = require("rubico");
const { identity } = require("rubico/x");
const shell = require("shelljs");

const Spinnies = require("spinnies");

const frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
const spinner = { interval: 300, frames };

exports.execCommand =
  ({ transform = identity, displayText } = {}) =>
  (command) =>
    pipe([
      () => new Spinnies({ spinner }),
      (spinnies) =>
        pipe([
          tap(() => {
            spinnies.add(command, {
              text: displayText || command,
              color: "green",
              status: "spinning",
            });
          }),
          () =>
            new Promise((resolve) => {
              shell.exec(
                transform(command),
                {
                  silent: true,
                  async: true,
                },
                (code, stdout, stderr) => {
                  resolve({ code, stdout, stderr });
                }
              );
            }),
          switchCase([
            eq(get("code"), 0),
            pipe([
              get("stdout"),
              pipe([
                tap((params) => {
                  assert(true);
                }),
                tryCatch(JSON.parse, (error, output) => output),
                tap((params) => {
                  spinnies.succeed(command);
                }),
              ]),
            ]),
            pipe([
              get("stderr"),
              tap((stderr) => {
                spinnies.fail(command, { text: `${command} ${stderr}` });
              }),
              (stderr) => {
                throw Error(stderr);
              },
            ]),
          ]),
        ])(),
    ])();
