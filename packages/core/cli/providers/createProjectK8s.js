const assert = require("assert");
const { pipe, get, tap, assign, eq, map, tryCatch } = require("rubico");
const { append } = require("rubico/x");
const prompts = require("prompts");
const shell = require("shelljs");
const { execCommandShell } = require("./createProjectCommon");

const k8sExecCommand =
  ({ displayText } = {}) =>
  (command) =>
    pipe([
      () => `kubectl ${command}`,
      execCommandShell({
        /*transform: append(" --output json"),*/ displayText,
      }),
    ])();

const isKubectlPresent = pipe([
  () => "help",
  tryCatch(
    pipe([
      k8sExecCommand(),
      tap((params) => {
        assert(true);
      }),
    ]),
    (error) => {
      console.error(
        "The kubectl CLI is not installed.\nVisit https://kubernetes.io/docs/tasks/tools/ to install kubectl\n"
      );
      process.exit(-1);
    }
  ),
]);

const createConfig = ({}) =>
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

exports.createProjectK8s = pipe([
  tap((params) => {
    assert(true);
  }),
  tap(isKubectlPresent),
  assign({ config: createConfig }),
  tap((params) => {
    assert(true);
  }),
  //TODO
]);
