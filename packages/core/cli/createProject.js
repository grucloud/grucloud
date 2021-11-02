const assert = require("assert");
const { pipe, get, fork, tap, assign, not, switchCase, eq } = require("rubico");
const { includes, when, append } = require("rubico/x");
const prompts = require("prompts");
const path = require("path");
const fs = require("fs").promises;
const fse = require("fs-extra");
const shell = require("shelljs");
const live = require("shelljs-live/promise");

const { createProjectGoogle } = require("./providers/createProjectGoogle");

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
      tap(({ source, destination }) =>
        fse.copy(source, destination, {
          filter: (source, destination) =>
            pipe([() => source, not(includes("node_modules"))])(),
        })
      ),
    ])();

const displayGuide = ({ provider, dirs: { destination } }) =>
  pipe([
    tap((params) => {
      console.log(`New ${provider} project created in ${destination}`);
      console.log(`What to do next ?`);
      console.log(`Step 1: cd ${destination}`);
      console.log(`Step 2: npm run list`);
      console.log(`Step 3: npm run gencode`);
    }),
  ])();

const npmInstall = ({ provider, dirs: { destination } }) =>
  pipe([
    tap((params) => {
      console.log(`cd ${destination}`);
    }),
    () =>
      shell.cd(destination, {
        silent: false,
      }),
    tap((params) => {
      console.log(`npm install`);
    }),
    () => live(["npm", "install"]),
    tap((params) => {
      assert(true);
    }),
  ])();

const updatePackageJson = ({ projectName, dirs: { destination } }) =>
  pipe([
    tap(() => {
      assert(destination);
      assert(projectName);
    }),
    () => path.resolve(destination, "package.json"),
    (filename) =>
      pipe([
        () => fs.readFile(filename, "utf-8"),
        JSON.parse,
        assign({ name: () => projectName }),
        JSON.stringify,
        (content) => fs.writeFile(filename, content),
      ])(),
  ])();

const createConfig = ({ projectId, projectName, dirs: { destination } }) =>
  pipe([
    tap(() => {
      assert(destination);
    }),
    () => path.resolve(destination, "config.js"),
    (filename) =>
      pipe([
        () => `module.exports = () => ({\n`,
        when(() => projectId, append(`  projectId: "${projectId}",\n`)),
        when(() => projectName, append(`  projectName: "${projectName}",\n`)),
        append("});"),
        tap((params) => {
          assert(true);
        }),
        (content) => fs.writeFile(filename, content),
      ])(),
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
      tap((params) => {
        assert(true);
      }),
      when(eq(get("provider"), "google"), createProjectGoogle),
      tap((params) => {
        assert(true);
      }),
      tap(updatePackageJson),
      tap(createConfig),
      tap(npmInstall),
      tap(displayGuide),
    ])();
