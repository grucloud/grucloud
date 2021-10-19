const assert = require("assert");
const { pipe, get, fork, tap, assign } = require("rubico");
const prompts = require("prompts");
const path = require("path");
const fs = require("fs").promises;
const fse = require("fs-extra");
const shell = require("shelljs");

const promptProvider = pipe([
  () => ({
    type: "select",
    name: "provider",
    message: "Cloud Provider",
    choices: [
      { title: "AWS", description: "Amazon Web Service", value: "aws" },
      {
        title: "Azure",
        description: "Microsoft Azure",
        value: "azure",
      },
      {
        title: "GCP",
        description: "Google Cloud Platform",
        value: "google",
      },
    ],
  }),
  prompts,
  get("provider"),
]);

const promptProjectName = pipe([
  () => ({
    type: "text",
    name: "projectName",
    message: "Project's name",
  }),
  prompts,
  get("projectName"),
]);

const writeDirectory =
  ({ commandOptions, programOptions }) =>
  ({ provider, projectName }) =>
    pipe([
      tap((params) => {
        assert(true);
      }),
      () => programOptions,
      get("workingDirectory", process.cwd()),
      fork({
        source: () => path.resolve(__dirname, "../template", provider),
        destination: (workingDirectory) =>
          path.resolve(workingDirectory, projectName),
      }),
      tap((params) => {
        assert(true);
      }),
      tap(({ source, destination }) => fse.copy(source, destination)),
    ])();

const displayGuide = ({ provider, dirs: { destination } }) =>
  pipe([
    tap((params) => {
      console.log(`New ${provider} project created in ${destination}`);
      console.log(`What to do next ?`);
      console.log(`Step 1: cd ${destination}`);
      console.log(`Step 2: npm install`);
      console.log(`Step 3: npm run list`);
      console.log(`Step 4: npm run gencode`);
    }),
  ])();

exports.createProject =
  ({ programOptions }) =>
  (commandOptions) =>
    pipe([
      () => ({}),
      assign({
        provider: promptProvider,
      }),
      assign({
        projectName: promptProjectName,
      }),
      assign({ dirs: writeDirectory({ commandOptions, programOptions }) }),
      displayGuide,
    ])();
