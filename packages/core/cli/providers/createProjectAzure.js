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
  includes,
} = require("rubico/x");
const path = require("path");
const prompts = require("prompts");
const os = require("os");
const fs = require("fs").promises;

//const logger = require("../../logger")({ prefix: "Azure" });

const { runShellCommands } = require("../runShellCommands");
assert(runShellCommands);
const RolesDefault = [
  "Owner",
  "Key Vault Administrator",
  "Key Vault Certificates Officer",
  "Key Vault Crypto Officer",
  "Key Vault Secrets Officer",
];

const NamespacesDefault = [
  "Microsoft.Compute",
  "Microsoft.ContainerService",
  "Microsoft.DocumentDB",
  "Microsoft.DBforPostgreSQL",
  "Microsoft.KeyVault",
  "Microsoft.Insights",
  "Microsoft.Network",
  "Microsoft.OperationalInsights",
  "Microsoft.Storage",
  "Microsoft.Web",
];

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
          title: `${id} - ${name}`,
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

const fetchServicePrincipalObjectId = pipe([
  tap((appId) => {
    assert(appId);
  }),
  (appId) => `az ad sp show --id ${appId} --query "id" --output tsv`,
  execCommandShell(),
  callProp("replace", os.EOL, ""),
]);

const registerNamespaces = () =>
  pipe([
    () => NamespacesDefault,
    map(prepend("az provider register --namespace ")),
    runShellCommands({
      text: "Register namespaces",
    }),
  ])();

const consentPermission = ({ principalId, resourceId, appRoleId }) =>
  pipe([
    tap(() => {
      assert(principalId);
      assert(resourceId);
      assert(appRoleId);
    }),
    () => [
      `az rest --method POST --uri https://graph.microsoft.com/v1.0/servicePrincipals/${resourceId}/appRoleAssignedTo --header Content-Type=application/json \
      --body '{ \
        "principalId": "${principalId}", \
        "resourceId": "${resourceId}",\
        "appRoleId": "${appRoleId}" \
      }' `,
    ],
    runShellCommands({
      text: "Consent Permission",
      ignoreError: includes(
        "Permission being assigned already exists on the object"
      ),
    }),
  ])();

exports.consentPermission = consentPermission;

const addAppPermission =
  ({ appRoleId, resourceId }) =>
  ({ app: { appId }, objectId, graphObjectId }) =>
    pipe([
      tap(() => {
        assert(appRoleId);
        assert(resourceId);
        assert(appId);
        assert(appRoleId);
        assert(graphObjectId);
      }),
      // https://graph.microsoft.com/Application.Read.All
      () => [
        `az ad app permission add --id ${appId} --api ${resourceId} --api-permissions ${appRoleId}=Role`,
      ],
      runShellCommands({
        text: "Add permission https://graph.microsoft.com/Application.Read.All",
      }),
      () => ({ principalId: objectId, resourceId: graphObjectId, appRoleId }),
      consentPermission,
    ])();

const createRoleAssignments = ({ account: { id }, app: { appId } }) =>
  pipe([
    tap(() => {
      assert(appId);
      assert(id);
    }),
    () => RolesDefault,
    map(
      (role) =>
        `az role assignment create --scope "/subscriptions/${id}" --role "${role}" --assignee ${appId}`
    ),
    runShellCommands({
      text: "Role Assignments",
    }),
  ])();

const writeEnv = ({ dirs, app, account, objectId }) =>
  pipe([
    tap(() => {
      assert(dirs);
      assert(dirs.destination);
      assert(app);
      assert(account);
      assert(objectId);
    }),
    assign({
      content: pipe([
        () => `AZURE_TENANT_ID=${account.tenantId}
AZURE_SUBSCRIPTION_ID=${account.id}
AZURE_CLIENT_ID=${app.appId}
AZURE_CLIENT_SECRET=${app.password}
AZURE_OBJECT_ID=${objectId}

`,
      ]),
      filename: () => path.resolve(dirs.destination, "auth.env"),
    }),
    tap(({ filename }) => {
      console.log(
        `Writing environment variables AZURE_TENANT_ID, AZURE_SUBSCRIPTION_ID, AZURE_CLIENT_ID and AZURE_CLIENT_SECRET to ${filename}`
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

const graphPrincipalId = "00000003-0000-0000-c000-000000000000";

exports.createProjectAzure = pipe([
  tap(isAzPresent),
  tap(isAuthenticated),
  assign({ account: promptSubscribtionId }),
  assign({ app: fetchAppIdPassword }),
  assign({ objectId: pipe([get("app.appId"), fetchServicePrincipalObjectId]) }),
  assign({
    graphObjectId: pipe([
      () => graphPrincipalId,
      fetchServicePrincipalObjectId,
    ]),
  }),
  tap(
    addAppPermission({
      resourceId: graphPrincipalId,
      // Application.Read.All
      appRoleId: "9a5d68dd-52b0-4cc2-bd40-abcf44ac3a30",
    })
  ),
  tap(createRoleAssignments),
  assign({ location: promptLocation }),
  assign({ config: createConfig }),
  tap(registerNamespaces),
  tap(writeEnv),
]);
