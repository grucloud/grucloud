const assert = require("assert");
const {
  pipe,
  get,
  filter,
  tap,
  assign,
  switchCase,
  eq,
  map,
  tryCatch,
} = require("rubico");
const { findIndex } = require("rubico/x");
const prompts = require("prompts");
const shell = require("shelljs");

const gcloudExecCommand = (command) =>
  pipe([
    () => `gcloud ${command} --format=json`,
    (commandFull) =>
      shell.exec(commandFull, {
        silent: true,
      }),
    switchCase([
      eq(get("code"), 0),
      pipe([
        get("stdout"),
        pipe([
          JSON.parse,
          tap((params) => {
            assert(true);
          }),
        ]),
      ]),
      pipe([
        get("stderr"),
        (stderr) => {
          throw Error(stderr);
        },
      ]),
    ]),
  ])();

const isGcloudPresent = pipe([
  () => "version",
  tryCatch(
    pipe([
      gcloudExecCommand,
      tap((params) => {
        assert(true);
      }),
    ]),
    (error) => {
      console.error(
        "The gcloud CLI is not installed.\nVisit https://https://cloud.google.com/sdk/docs/install to install gcloud\nReme"
      );
      process.exit(-1);
    }
  ),
]);

const promptGoogleProjectId = pipe([
  () => `config get-value project`,
  gcloudExecCommand,
  (projectCurrent) =>
    pipe([
      () => `projects list`,
      gcloudExecCommand,
      filter(eq(get("lifecycleState"), "ACTIVE")),
      map(({ name, projectId }) => ({
        title: projectId,
        description: name,
        value: projectId,
      })),
      (choices) => ({
        type: "select",
        name: "projectId",
        message: "Select the project Id",
        choices,
        initial: findIndex(eq(get("value"), projectCurrent))(choices),
      }),
      prompts,
      get("projectId"),
    ])(),
]);

exports.createProjectGoogle = pipe([
  tap((params) => {
    assert(true);
  }),
  tap(isGcloudPresent),
  tap((params) => {
    assert(true);
  }),
  assign({ projectId: promptGoogleProjectId }),
  tap((params) => {
    assert(true);
  }),
]);
