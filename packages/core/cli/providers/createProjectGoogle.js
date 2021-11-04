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
const { findIndex, append } = require("rubico/x");
const prompts = require("prompts");
const shell = require("shelljs");

const { execCommand } = require("./createProjectCommon");

const gcloudExecCommand = (command) =>
  pipe([
    () => `gcloud ${command}`,
    execCommand({ transform: append(" --format=json") }),
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
        "The gcloud CLI is not installed.\nVisit https://https://cloud.google.com/sdk/docs/install to install gcloud\n"
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
  assign({ projectId: promptGoogleProjectId }),
  tap((params) => {
    assert(true);
  }),
]);
