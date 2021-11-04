const assert = require("assert");
const { pipe, get, tap, switchCase, eq } = require("rubico");
const { identity } = require("rubico/x");
const shell = require("shelljs");

const Spinnies = require("spinnies");

const frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
const spinner = { interval: 300, frames };

exports.execCommand =
  ({ transform = identity } = {}) =>
  (command) =>
    pipe([
      () => new Spinnies({ spinner }),
      (spinnies) =>
        pipe([
          tap(() => {
            spinnies.add(command, {
              text: command,
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
                JSON.parse,
                tap((params) => {
                  spinnies.succeed(command);
                }),
              ]),
            ]),
            pipe([
              tap((params) => {
                spinnies.fail(command);
              }),
              get("stderr"),
              (stderr) => {
                throw Error(stderr);
              },
            ]),
          ]),
        ])(),
    ])();
