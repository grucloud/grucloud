const assert = require("assert");
const { pipe, get, tap, assign, eq, map, tryCatch } = require("rubico");
const { findIndex, find, append, callProp } = require("rubico/x");
const path = require("path");
const prompts = require("prompts");
const fs = require("fs").promises;

const { execCommand } = require("./createProjectCommon");

const isAzPresent = pipe([
  () => "az version",
  tryCatch(
    pipe([
      execCommand(),
      tap((version) => {
        //console.log("az version: ", version["azure-cli"]);
      }),
    ]),
    (error) => {
      console.error(
        "The az CLI is not installed.\nVisit https://docs.microsoft.com/en-us/cli/azure/install-azure-cli to install az\n"
      );
      process.exit(-1);
    }
  ),
]);

// az account show
const isAuthenticated = pipe([
  () => "az account show",
  tryCatch(
    pipe([
      execCommand(),
      tap((account) => {
        //console.log(account);
      }),
    ]),
    (error) =>
      pipe([
        () => {
          //console.error("not authenticated");
        },
        azLogin,
        isAuthenticated,
      ])()
  ),
]);

const azLogin = pipe([
  () => "az login",
  tryCatch(
    pipe([
      execCommand(),
      tap((account) => {
        //console.log(account);
      }),
    ]),
    (error) => {
      throw Error("Could not authenticate");
    }
  ),
]);

const promptSubscribtionId = pipe([
  tap((params) => {
    assert(true);
  }),
  () => `az account list`,
  execCommand(),
  (accounts) =>
    pipe([
      () => accounts,
      map(({ name, id }) => ({
        title: id,
        description: `${name}`,
        value: id,
      })),
      (choices) => ({
        type: "select",
        name: "subscriptionId",
        message: "Select the Subscription Id",
        choices,
        initial: findIndex(get("isDefault"))(accounts),
      }),
      prompts,
      get("subscriptionId"),
      (subscriptionId) =>
        pipe([
          () => accounts,
          find(eq(get("id"), subscriptionId)),
          tap((account) => {
            assert(account);
          }),
        ])(),
    ])(),
]);

const fetchAppIdPassword = pipe([
  tap((params) => {
    assert(true);
  }),
  () => `az ad sp create-for-rbac -n sp1`,
  execCommand(),
  tap(({ appId, password }) => {
    assert(appId);
    assert(password);
  }),
]);

const writeEnv = ({ dirs, app, account }) =>
  pipe([
    tap(() => {
      assert(dirs);
      assert(app);
      assert(account);
    }),
    assign({
      content: pipe([
        () => `TENANT_ID=${account.tenantId}
SUBSCRIPTION_ID=${account.id}
APP_ID=${app.appId}
PASSWORD=${app.password}
`,
      ]),
      filename: () => path.resolve(dirs.destination, "default.env"),
    }),
    tap(({ content, filename }) => {
      console.log(`Writing environemnt file to ${filename}`);
    }),
    ({ content, filename }) => fs.writeFile(filename, content),
  ])();

const promptLocation = ({}) =>
  pipe([
    () => `az account list-locations`,
    execCommand(),
    callProp("sort", (a, b) =>
      a.regionalDisplayName.localeCompare(b.regionalDisplayName)
    ),
    map(({ regionalDisplayName, name }) => ({
      title: name,
      description: regionalDisplayName,
      value: name,
    })),
    (choices) => ({
      type: "autocomplete",
      limit: 40,
      name: "location",
      message: "Select a location",
      choices,
    }),
    prompts,
    get("location"),
  ])();

const createConfig = ({ location, projectName, dirs: { destination } }) =>
  pipe([
    tap(() => {
      assert(destination);
    }),
    () => path.resolve(destination, "config.js"),
    (filename) =>
      pipe([
        () => `module.exports = () => ({\n`,
        append(`  projectName: "${projectName}",\n`),
        append(`  location: "${location}",\n`),
        append("});"),
        tap((params) => {
          assert(true);
        }),
        (content) => fs.writeFile(filename, content),
      ])(),
  ])();

exports.createProjectAzure = pipe([
  tap((params) => {
    assert(true);
  }),
  tap(isAzPresent),
  tap(isAuthenticated),
  assign({ account: promptSubscribtionId }),
  assign({ app: fetchAppIdPassword }),
  assign({ location: promptLocation }),
  tap(writeEnv),
  tap(createConfig),
]);
