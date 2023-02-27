const assert = require("assert");
const { assign, map, pick, pipe, tap, omit, get, tryCatch } = require("rubico");
const { when, defaultsDeep } = require("rubico/x");
const { replaceWithName } = require("@grucloud/core/Common");

const fs = require("fs").promises;
const path = require("path");

const { createAwsService } = require("../AwsService");
const { compareAws, isOurMinionObject } = require("../AwsCommon");

const { AppSyncFunction } = require("./AppSyncFunction");

const { AppSyncGraphqlApi } = require("./AppSyncGraphqlApi");
const { AppSyncDataSource } = require("./AppSyncDataSource");
const { AppSyncResolver } = require("./AppSyncResolver");

const GROUP = "AppSync";
const tagsKey = "tags";

const compare = compareAws({ tagsKey });

const isOurMinion = ({ live, config }) =>
  isOurMinionObject({ tags: live.tags, config });

const graphqlSchemaFilePath = ({ programOptions, commandOptions, resource }) =>
  path.resolve(programOptions.workingDirectory, `${resource.name}.graphql`);

const writeGraphqlSchema =
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
      (content) =>
        tryCatch(
          pipe([
            () =>
              graphqlSchemaFilePath({
                programOptions,
                commandOptions,
                resource,
              }),
            tap((filePath) => {
              console.log("Writing graphql schema:", filePath);
            }),
            (filePath) => fs.writeFile(filePath, content),
          ]),
          (error) => {
            console.error("Error writing graphql schema", error);
            throw error;
          }
        )(),
    ])();

module.exports = pipe([
  () => [
    createAwsService(AppSyncDataSource({ compare })),
    createAwsService(AppSyncFunction({})),
    {
      type: "GraphqlApi",
      Client: AppSyncGraphqlApi,
      inferName: () => get("name"),
      omitProperties: [
        "apiId",
        "arn",
        "uris",
        "wafWebAclArn",
        "logConfig.cloudWatchLogsRoleArn",
      ],
      compare: compare({
        filterTarget: () => pipe([omit(["schemaFile"])]),
        filterLive: () =>
          pipe([
            assign({
              apiKeys: pipe([get("apiKeys"), map(pick(["description"]))]),
            }),
          ]),
      }),
      filterLive: (input) => (live) =>
        pipe([
          () => input,
          tap(writeGraphqlSchema(input)),
          () => live,
          pick([
            "name",
            "authenticationType",
            "xrayEnabled",
            "logConfig",
            "apiKeys",
            "additionalAuthenticationProviders",
          ]),
          assign({
            schemaFile: () => `${live.name}.graphql`,
            apiKeys: pipe([get("apiKeys"), map(pick(["description"]))]),
          }),
          when(
            get("additionalAuthenticationProviders"),
            assign({
              additionalAuthenticationProviders: pipe([
                get("additionalAuthenticationProviders"),
                map(
                  assign({
                    userPoolConfig: pipe([
                      get("userPoolConfig"),
                      assign({
                        userPoolId: pipe([
                          get("userPoolId"),
                          replaceWithName({
                            groupType:
                              "CognitoIdentityServiceProvider::UserPool",
                            path: "id",
                            ...input,
                          }),
                        ]),
                      }),
                    ]),
                  })
                ),
              ]),
            })
          ),
        ])(),
      dependencies: {
        cloudWatchLogsRole: {
          type: "Role",
          group: "IAM",
          dependencyId: ({ lives, config }) =>
            get("logConfig.cloudWatchLogsRoleArn"),
        },
        userPools: {
          type: "UserPool",
          group: "CognitoIdentityServiceProvider",
          list: true,
          dependencyIds: () =>
            pipe([
              get("additionalAuthenticationProviders"),
              map(get("userPoolConfig.userPoolId")),
            ]),
        },
      },
    },
    createAwsService(AppSyncResolver({ compare })),
  ],
  map(
    defaultsDeep({ group: GROUP, tagsKey, isOurMinion, compare: compare({}) })
  ),
]);
