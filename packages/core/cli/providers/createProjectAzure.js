const assert = require("assert");
const { pipe, get, tap, assign, eq, map, tryCatch } = require("rubico");
const {
  findIndex,
  find,
  append,
  prepend,
  callProp,
  when,
  identity,
  unless,
  isEmpty,
} = require("rubico/x");
const path = require("path");
const prompts = require("prompts");
const fs = require("fs").promises;

const { execCommandShell } = require("./createProjectCommon");

const isAzPresent = pipe([
  () => "az version",
  tryCatch(pipe([execCommandShell()]), (error) => {
    console.error(
      "The az CLI is not installed.\nVisit https://docs.microsoft.com/en-us/cli/azure/install-azure-cli to install az\n"
    );
    process.exit(-1);
  }),
]);

// az account show
const isAuthenticated = pipe([
  () => "az account show",
  tryCatch(
    pipe([
      execCommandShell(),
      tap((params) => {
        assert(true);
      }),
    ]),
    (error) => pipe([azLogin, isAuthenticated])()
  ),
]);

const azLogin = pipe([
  () => "az login",
  tryCatch(pipe([execCommandShell()]), (error) => {
    throw Error("Could not authenticate");
  }),
]);

const promptSubscribtionId = (params) =>
  pipe([
    tap(() => {
      assert(params);
    }),
    () => `az account list`,
    execCommandShell(),
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
  tap(({ projectName }) => {
    assert(projectName);
  }),
  ({ projectName }) => ({
    type: "text",
    name: "servicePrincipal",
    message: "Service Principal",
    initial: `sp-${projectName}`,
    validate: (servicePrincipal) =>
      isEmpty(servicePrincipal) ? `should not be empty` : true,
  }),
  prompts,
  get("servicePrincipal"),
  unless(
    isEmpty,
    pipe([
      prepend("az ad sp create-for-rbac -n http://"),
      execCommandShell(),
      tap(({ appId, password }) => {
        assert(appId);
        assert(password);
      }),
    ])
  ),
]);
const NamespacesDefault = ["Microsoft.Network", "Microsoft.Compute"];

const registerNamespaces = () =>
  pipe([
    () => NamespacesDefault,
    map.series((namespace) =>
      pipe([
        () => `az provider register --namespace ${namespace}`,
        execCommandShell(),
      ])()
    ),
  ])();

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
    execCommandShell(),
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

const createConfig = ({ location }) =>
  pipe([
    tap(() => {
      assert(location);
    }),
    () => "",
    append(`const pkg = require("./package.json");\n`),
    append(`module.exports = () => ({\n`),
    append("  projectName: pkg.name,\n"),
    append(`  location: "${location}",\n`),
    append("});"),
    tap((params) => {
      assert(true);
    }),
  ])();

exports.createProjectAzure = pipe([
  tap(isAzPresent),
  tap(isAuthenticated),
  assign({ account: promptSubscribtionId }),
  assign({ app: fetchAppIdPassword }),
  assign({ location: promptLocation }),
  assign({ config: createConfig }),
  tap(registerNamespaces),
  tap(writeEnv),
]);
