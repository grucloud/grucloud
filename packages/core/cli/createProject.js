const assert = require("assert");
const { pipe, get, fork, tap, assign, not, eq } = require("rubico");
const { includes, when, append, isEmpty } = require("rubico/x");
const prompts = require("prompts");
const path = require("path");
const fs = require("fs").promises;
const fse = require("fs-extra");
const shell = require("shelljs");
const live = require("shelljs-live/promise");

const logger = require("../logger")({ prefix: "Infra" });

const { createProjectAws } = require("./providers/createProjectAws");
const { createProjectGoogle } = require("./providers/createProjectGoogle");
const { createProjectAzure } = require("./providers/createProjectAzure");
const { createProjectK8s } = require("./providers/createProjectK8s");

// NPM removes the .gitignore file when publishing the package
const GitIgnoreContent = `
*.env
*.log
*.pem
node_modules
`;

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
      {
        title: "K8s",
        description: "Kubernetes",
        value: "k8s",
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
    validate: (projectName) =>
      isEmpty(projectName) ? `should not be empty` : true,
  }),
  prompts,
  get("projectName"),
]);

const writeDirectory =
  ({ commandOptions, programOptions }) =>
  ({ provider, projectName }) =>
    pipe([
      tap((params) => {
        assert(provider);
        assert(projectName);
      }),
      () => programOptions,
      get("workingDirectory", process.cwd()),
      fork({
        source: () => path.resolve(__dirname, "../template", provider),
        destination: (workingDirectory) =>
          path.resolve(workingDirectory, projectName),
      }),
      tap(({ source, destination }) => {
        logger.debug(`from ${source} to ${destination}`);
      }),
      tap(({ source, destination }) =>
        fse.copy(source, destination, {
          filter: (sourceFile, destination) =>
            pipe([
              () => sourceFile,
              not(includes(`${projectName}/node_modules`)),
              tap((params) => {
                logger.debug(`copy ${sourceFile}`);
              }),
            ])(),
        })
      ),
      tap((params) => {
        logger.debug(`copied`);
      }),
    ])();

const displayGuide = ({ provider, dirs: { destination } }) =>
  pipe([
    tap((params) => {
      console.log(`New ${provider} project created in ${destination}`);
      console.log(`What to do next ?`);
      console.log(`Step 1: cd ${destination}`);
      console.log(`Step 2: gc init`);
      console.log(`Step 3: gc list --graph`);
      console.log(`Step 5: gc gencode`);
      console.log(`Step 6: gc destroy`);
      console.log(`Step 7: gc apply`);
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
        (content) => JSON.stringify(content, null, 2),
        (content) => fs.writeFile(filename, content),
      ])(),
  ])();

const writeConfigToFile = ({ config, dirs: { destination } }) =>
  pipe([
    tap(() => {
      assert(destination);
      assert(config);
    }),
    () => path.resolve(destination, "config.js"),
    (filename) => fs.writeFile(filename, config),
  ])();

const writeGitIgnore = ({ dirs: { destination } }) =>
  pipe([
    tap(() => {
      assert(destination);
    }),
    () => path.resolve(destination, ".gitignore"),
    (filename) => fs.writeFile(filename, GitIgnoreContent),
  ])();

exports.writeConfigToFile = writeConfigToFile;

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
      assign({
        dirs: writeDirectory({ commandOptions, programOptions }),
      }),
      tap((params) => {
        assert(true);
      }),
      when(eq(get("provider"), "aws"), createProjectAws),
      when(eq(get("provider"), "google"), createProjectGoogle),
      when(eq(get("provider"), "azure"), createProjectAzure),
      when(eq(get("provider"), "k8s"), createProjectK8s),
      tap((params) => {
        assert(true);
      }),
      tap(updatePackageJson),
      tap(writeConfigToFile),
      tap(npmInstall),
      tap(writeGitIgnore),
      tap(displayGuide),
    ])();
