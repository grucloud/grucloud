const assert = require("assert");
const { pipe, get, tap, assign, eq, map, tryCatch } = require("rubico");
const {
  findIndex,
  find,
  append,
  callProp,
  when,
  identity,
} = require("rubico/x");
const path = require("path");
const prompts = require("prompts");
const fs = require("fs").promises;

const { execCommand } = require("./createProjectCommon");

const isAzPresent = pipe([
  () => "az version",
  tryCatch(pipe([execCommand()]), (error) => {
    console.error(
      "The az CLI is not installed.\nVisit https://docs.microsoft.com/en-us/cli/azure/install-azure-cli to install az\n"
    );
    process.exit(-1);
  }),
]);

// az account show
const isAuthenticated = pipe([
  () => "az account show",
  tryCatch(pipe([execCommand()]), (error) =>
    pipe([azLogin, isAuthenticated])()
  ),
]);

const azLogin = pipe([
  () => "az login",
  tryCatch(pipe([execCommand()]), (error) => {
    throw Error("Could not authenticate");
  }),
]);

const promptSubscribtionId = (params) =>
  pipe([
    tap(() => {
      assert(params);
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
  ])();

const fetchAppIdPassword = pipe([
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
      assert(dirs.destination);
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
      filename: () => path.resolve(dirs.destination, "auth.env"),
    }),
    tap(({ filename }) => {
      console.log(
        `Writing environment variables TENANT_ID, SUBSCRIPTION_ID, APP_ID and PASSWORD to ${filename}`
      );
    }),
    ({ content, filename }) => fs.writeFile(filename, content),
  ])();

const findDefaultLocation = ({ config, choices }) =>
  pipe([
    () => choices,
    findIndex(eq(get("value"), config.location)),
    when(eq(identity, -1), () => 0),
  ])();

const promptLocation = ({ config = {} }) =>
  pipe([
    tap(() => {
      assert(true);
    }),
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
      initial: findDefaultLocation({ config, choices }),
    }),
    prompts,
    get("location"),
  ])();

const createConfig = ({ location, dirs: { destination } }) =>
  pipe([
    tap(() => {
      assert(destination);
      assert(location);
    }),
    () => path.resolve(destination, "config.js"),
    (filename) =>
      pipe([
        () => "",
        append(`const pkg = require("./package.json");\n`),
        append(`module.exports = () => ({\n`),
        append("  projectName: pkg.name,\n"),
        append(`  location: "${location}",\n`),
        append("});"),
        (content) => fs.writeFile(filename, content),
        tap(() => {
          console.log(`Writing config file to ${filename}`);
        }),
      ])(),
  ])();

exports.createProjectAzure = pipe([
  tap(isAzPresent),
  tap(isAuthenticated),
  assign({ account: promptSubscribtionId }),
  assign({ app: fetchAppIdPassword }),
  assign({ location: promptLocation }),
  tap(writeEnv),
  tap(createConfig),
]);
