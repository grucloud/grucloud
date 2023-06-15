const assert = require("assert");
const { pipe, get, tap, switchCase, eq, tryCatch } = require("rubico");
const { identity, isFunction, append } = require("rubico/x");
const shell = require("shelljs");
const prompts = require("prompts");

const Spinnies = require("spinnies");

const frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
const spinner = { interval: 300, frames };

const promptOnCancel = (prompt) => {
  console.log("Canceled, quit now");
  process.exit(-2);
};

exports.myPrompts = (question) =>
  prompts(question, { onCancel: promptOnCancel });

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
                spinnies.succeed(textStart, {
                  text: textEnd ? textEnd({ textStart, result }) : textStart,
                });
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
  ({ transform = identity, textEnd } = {}) =>
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
                  () => code === 0,
                  pipe([
                    () => stdout,
                    pipe([
                      tryCatch(JSON.parse, (error, output) => output),
                      resolve,
                    ]),
                  ]),
                  pipe([() => stderr, reject]),
                ]),
              ])()
          );
        }),
      execCommand({ textStart: command, textEnd }),
    ])();

exports.createConfig = ({ profile, partition }) =>
  pipe([
    tap(() => {
      assert(profile);
      assert(partition);
    }),
    () => `const pkg = require("./package.json");
module.exports = () => ({
  projectName: pkg.name,
  // includeGroups: ["EC2", "ECS", "IAM", "KMS", "RDS"],
  // excludeGroups: [],
  credentials: { profile: "${profile}" },
  partition: "${partition}"
});
`,
    tap((params) => {
      assert(true);
    }),
  ])();
