const assert = require("assert");
const { pipe, get, tap, assign, eq, map, tryCatch } = require("rubico");
const path = require("path");
const { findIndex, find } = require("rubico/x");
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

exports.createProjectAzure = pipe([
  tap((params) => {
    assert(true);
  }),
  tap(isAzPresent),
  assign({ account: promptSubscribtionId }),
  assign({ app: fetchAppIdPassword }),
  tap(writeEnv),
]);
