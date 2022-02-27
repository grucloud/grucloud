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
const { compareAws, isOurMinionObject } = require("../AwsCommon");

const { RestApi } = require("./RestApi");
const { Stage } = require("./Stage");
const { DomainName } = require("./DomainName");
const { Authorizer } = require("./Authorizer");
const { ApiKey } = require("./ApiKey");
const { Account } = require("./Account");

const GROUP = "APIGateway";

const schemaFilePath = ({ programOptions, commandOptions, resource }) =>
  path.resolve(programOptions.workingDirectory, `${resource.name}.oas30.json`);

const writeRestApiSchema =
  ({ programOptions, commandOptions }) =>
  ({ lives, resource }) =>
    pipe([
      tap((params) => {
        assert(programOptions);
        assert(lives);
        assert(resource);
      }),
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

module.exports = () =>
  map(assign({ group: () => GROUP }))([
    {
      type: "DomainName",
      dependsOn: ["ACM::Certificate"],
      Client: DomainName,
      isOurMinion: ({ live, config }) =>
        isOurMinionObject({ tags: live.tags, config }),
      compare: compareAws({
        filterTarget: () =>
          pipe([
            tap((params) => {
              assert(true);
            }),
          ]),
        filterLive: () =>
          pipe([
            tap((params) => {
              assert(true);
            }),
          ]),
      }),
      filterLive: () =>
        pipe([
          tap((params) => {
            assert(true);
          }),
          omit(["DomainName"]),
        ]),
      dependencies: {
        certificate: { type: "Certificate", group: "ACM" },
      },
    },
    {
      type: "Account",
      dependsOn: ["IAM::Role"],
      Client: Account,
      isOurMinion: ({ live, config }) => true,
      compare: compareAws({
        filterTarget: () =>
          pipe([
            tap((params) => {
              assert(true);
            }),
            defaultsDeep({
              features: ["UsagePlans"],
            }),
          ]),
        filterLive: () =>
          pipe([
            tap((params) => {
              assert(true);
            }),
            omit(["throttleSettings", "apiKeyVersion"]),
          ]),
      }),
      filterLive: () =>
        pipe([
          omit([
            "apiKeyVersion",
            "throttleSettings",
            "features",
            "cloudwatchRoleArn",
          ]),
        ]),
      dependencies: {
        cloudwatchRole: { type: "Role", group: "IAM" },
      },
    },
    {
      type: "ApiKey",
      Client: ApiKey,
      isOurMinion: ({ live, config }) =>
        isOurMinionObject({ tags: live.tags, config }),
      compare: compareAws({
        filterTarget: () =>
          pipe([
            tap((params) => {
              assert(true);
            }),
          ]),
        filterLive: () =>
          pipe([
            tap((params) => {
              assert(true);
            }),
            omit(["id", "createdDate", "lastUpdatedDate", "stageKeys"]),
          ]),
      }),
      propertiesDefault: { enabled: true },
      filterLive: () =>
        pipe([
          tap((params) => {
            assert(true);
          }),
          omit(["name", "id", "createdDate", "lastUpdatedDate", "stageKeys"]),
        ]),
    },
    {
      type: "RestApi",
      Client: RestApi,
      isOurMinion: ({ live, config }) =>
        isOurMinionObject({ tags: live.tags, config }),
      compare: compareAws({
        filterTarget: () =>
          pipe([
            tap((params) => {
              assert(true);
            }),
            omit(["schemaFile", "deployment"]),
            defaultsDeep({ disableExecuteApiEndpoint: false }),
          ]),
        filterLive: () =>
          pipe([
            tap((params) => {
              assert(true);
            }),
            omit(["id", "createdDate", "deployments", "version"]),
          ]),
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
          tap(() => {
            assert(true);
          }),
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
      dependsOn: ["APIGateway::RestApi"],
      dependsOnList: ["APIGateway::RestApi"],
      Client: Stage,
      isOurMinion: ({ live, config }) =>
        isOurMinionObject({ tags: live.tags, config }),
      compare: compareAws({
        filterTarget: () =>
          pipe([
            tap((params) => {
              assert(true);
            }),
            defaultsDeep({ cacheClusterEnabled: false, tracingEnabled: false }),
            omit(["deploymentId"]),
          ]),
        filterLive: () =>
          pipe([
            tap((params) => {
              assert(true);
            }),
            omit([
              "deploymentId",
              "clientCertificateId",
              "createdDate",
              "lastUpdatedDate",
              "cacheClusterStatus",
            ]),
            omitIfEmpty(["methodSettings"]),
          ]),
      }),
      filterLive: () =>
        pipe([
          tap((params) => {
            assert(true);
          }),
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
          tap((params) => {
            assert(true);
          }),
        ]),
      dependencies: {
        restApi: { type: "RestApi", group: "APIGateway", parent: true },
      },
    },
    {
      type: "Authorizer",
      dependsOn: ["APIGateway::RestApi"],
      dependsOnList: ["APIGateway::RestApi"],
      Client: Authorizer,
      isOurMinion: ({ live, config }) =>
        isOurMinionObject({ tags: live.tags, config }),
      compare: compareAws({
        filterTarget: () =>
          pipe([
            tap((params) => {
              assert(true);
            }),
          ]),
        filterLive: () =>
          pipe([
            tap((params) => {
              assert(true);
            }),
          ]),
      }),
      filterLive: () =>
        pipe([
          tap((params) => {
            assert(true);
          }),
          omit(["id", "name", "restApiId", "providerARNs"]),
        ]),
      dependencies: {
        restApi: { type: "RestApi", group: "APIGateway", parent: true },
        lambdaFunction: { type: "Function", group: "Lambda" },
        userPool: { type: "UserPool", group: "Cognito" },
      },
    },
  ]);
