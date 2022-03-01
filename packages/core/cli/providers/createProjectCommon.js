const assert = require("assert");
const { pipe, get, tap, switchCase, eq, tryCatch } = require("rubico");
const { identity, isFunction, append } = require("rubico/x");
const shell = require("shelljs");

const Spinnies = require("spinnies");

const frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
const spinner = { interval: 300, frames };

const execCommand =
  ({ textStart, textEnd, textError }) =>
  (asyncCommand) =>
    pipe([
      () => new Spinnies({ spinner }),
      (spinnies) =>
        pipe([
          tap((params) => {
            assert(isFunction(asyncCommand));
          }),
          tap(() => {
            spinnies.add(textStart, {
              text: textStart,
              color: "green",
              status: "spinning",
            });
          }),
          tryCatch(
            pipe([
              asyncCommand,
              tap((result) => {
                spinnies.succeed(textStart);
              }),
            ]),
            pipe([
              tap((error) => {
                spinnies.fail(textStart, {
                  text: `${textError || textStart}, error: ${error}`,
                });
              }),
              (error) => {
                throw error;
              },
            ])
          ),
        ])(),
    ])();

exports.execCommand = execCommand;

exports.execCommandShell =
  ({ transform = identity } = {}) =>
  (command) =>
    pipe([
      () => () =>
        new Promise((resolve, reject) => {
          shell.exec(
            transform(command),
            {
              silent: true,
              async: true,
            },
            (code, stdout, stderr) =>
              pipe([
                switchCase([
                  eq(code, 0),
                  pipe([
                    tap((params) => {
                      assert(true);
                    }),
                    () => stdout,
                    pipe([
                      tryCatch(JSON.parse, (error, output) => output),
                      resolve,
                    ]),
                  ]),
                  pipe([
                    () => stderr,
                    tap((params) => {
                      assert(true);
                    }),
                    reject,
                  ]),
                ]),
              ])()
          );
        }),
      execCommand({ textStart: command }),
    ])();

exports.createConfig = ({}) =>
  pipe([
    tap(() => {
      assert(true);
    }),
    () => "",
    append(`const pkg = require("./package.json");\n`),
    append(`module.exports = () => ({\n`),
    append("  projectName: pkg.name,\n"),
    append("});"),
    tap((params) => {
      assert(true);
    }),
  ])();
