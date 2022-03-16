const assert = require("assert");
const {
  tryCatch,
  pipe,
  assign,
  map,
  tap,
  omit,
  pick,
  get,
  eq,
  and,
} = require("rubico");
const { defaultsDeep, first, find } = require("rubico/x");
const fs = require("fs").promises;
const prettier = require("prettier");
const path = require("path");

const { omitIfEmpty } = require("@grucloud/core/Common");
const { isOurMinionObject, compareAws } = require("../AwsCommon");

const { RestApi } = require("./RestApi");
const { Stage } = require("./Stage");
const { Authorizer } = require("./Authorizer");
const { ApiKey } = require("./ApiKey");
const { Account } = require("./Account");
const { Method } = require("./Method");
const { Resource } = require("./Resource");
//const { Integration } = require("./Integration");

const GROUP = "APIGateway";
const tagsKey = "tags";
const compareAPIGateway = compareAws({ tagsKey });

const schemaFilePath = ({ programOptions, commandOptions, resource }) =>
  path.resolve(programOptions.workingDirectory, `${resource.name}.oas30.json`);

const writeRestApiSchema =
  ({ programOptions, commandOptions }) =>
  ({ lives, resource }) =>
    pipe([
      () => resource,
      get("live.schema"),
      (json) => JSON.stringify(json, null, 4),
      (content) => prettier.format(content, { parser: "json" }),
      (content) =>
        tryCatch(
          pipe([
            () => schemaFilePath({ programOptions, commandOptions, resource }),
            tap((filePath) => {
              console.log("Writing rest api schema:", filePath);
            }),
            (filePath) => fs.writeFile(filePath, content),
          ]),
          (error) => {
            console.error("Error writing rest api schema", error);
            throw error;
          }
        )(),
    ])();

module.exports = pipe([
  () => [
    {
      type: "Account",
      Client: Account,
      isOurMinion: ({ live, config }) => true,
      omitProperties: ["apiKeyVersion", "throttleSettings"],
      propertiesDefault: {
        features: ["UsagePlans"],
      },
      filterLive: () => pipe([omit(["features", "cloudwatchRoleArn"])]),
      dependencies: {
        cloudwatchRole: { type: "Role", group: "IAM" },
      },
    },
    {
      type: "ApiKey",
      Client: ApiKey,
      omitProperties: [
        "name",
        "id",
        "createdDate",
        "lastUpdatedDate",
        "stageKeys",
      ],
      propertiesDefault: { enabled: true },
    },
    {
      type: "Resource",
      Client: Resource,
      dependencies: {
        restApi: { type: "RestApi", group: "APIGateway", parent: true },
      },
      ignoreResource: () => () => true,
      cannotBeDeleted: () => true,
    },
    {
      type: "Method",
      Client: Method,
      dependencies: {
        resource: { type: "Resource", group: "APIGateway", parent: true },
      },
      ignoreResource: () => () => true,
      cannotBeDeleted: () => true,
    },
    {
      type: "RestApi",
      Client: RestApi,
      omitProperties: ["id", "createdDate", "deployments", "version"],
      propertiesDefault: { disableExecuteApiEndpoint: false },
      compare: compareAPIGateway({
        filterTarget: () => pipe([omit(["schemaFile", "deployment"])]),
      }),
      filterLive: (input) => (live) =>
        pipe([
          tap(() => {
            assert(input);
          }),
          () => input,
          tap(writeRestApiSchema(input)),
          () => live,
          pick(["apiKeySource", "endpointConfiguration"]),
          assign({
            schemaFile: () => `${live.name}.oas30.json`,
            deployment: pipe([
              () => live,
              get("deployments"),
              first,
              get("id"),
              (deploymentId) =>
                pipe([
                  () => input.lives,
                  find(
                    and([
                      eq(get("groupType"), "APIGateway::Stage"),
                      eq(get("live.deploymentId"), deploymentId),
                    ])
                  ),
                  get("name"),
                ])(),
              (stageName) => ({
                stageName,
              }),
            ]),
          }),
        ])(),
    },
    {
      type: "Stage",
      Client: Stage,
      omitProperties: [
        "deploymentId",
        "clientCertificateId",
        "createdDate",
        "lastUpdatedDate",
        "cacheClusterStatus",
      ],
      propertiesDefault: { cacheClusterEnabled: false, tracingEnabled: false },
      compare: compareAPIGateway({
        filterLive: () => pipe([omitIfEmpty(["methodSettings"])]),
      }),
      filterLive: () =>
        pipe([
          pick([
            "description",
            "StageName",
            "StageVariables",
            "methodSettings",
            "accessLogSettings",
            "cacheClusterEnabled",
            "cacheClusterSize",
            "tracingEnabled",
          ]),
          omitIfEmpty(["methodSettings"]),
        ]),
      dependencies: {
        restApi: { type: "RestApi", group: "APIGateway", parent: true },
      },
    },
    {
      type: "Authorizer",
      Client: Authorizer,
      omitProperties: ["id", "name", "restApiId", "providerARNs"],
      dependencies: {
        restApi: { type: "RestApi", group: "APIGateway", parent: true },
        lambdaFunction: { type: "Function", group: "Lambda" },
        userPools: {
          type: "UserPool",
          group: "CognitoIdentityServiceProvider",
          list: true,
        },
      },
    },
  ],
  map(
    defaultsDeep({
      group: GROUP,
      tagsKey,
      compare: compareAPIGateway({}),
      isOurMinion: ({ live, config }) =>
        isOurMinionObject({ tags: live.tags, config }),
    })
  ),
]);
