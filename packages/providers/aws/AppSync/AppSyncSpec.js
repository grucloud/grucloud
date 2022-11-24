const assert = require("assert");
const {
  assign,
  map,
  pick,
  pipe,
  tap,
  omit,
  get,
  tryCatch,
  eq,
} = require("rubico");
const { when, defaultsDeep } = require("rubico/x");

const fs = require("fs").promises;
const path = require("path");

const { omitIfEmpty } = require("@grucloud/core/Common");
const {
  compareAws,
  isOurMinionObject,
  replaceRegion,
} = require("../AwsCommon");

const { findDependenciesGraphqlId } = require("./AppSyncCommon");

const { AppSyncGraphqlApi } = require("./AppSyncGraphqlApi");
const { AppSyncDataSource } = require("./AppSyncDataSource");
const { AppSyncResolver } = require("./AppSyncResolver");

const GROUP = "AppSync";
const tagsKey = "tags";

const compareAppSync = compareAws({ tagsKey });

const isOurMinion = ({ live, config }) =>
  isOurMinionObject({ tags: live.tags, config });

const graphqlSchemaFilePath = ({ programOptions, commandOptions, resource }) =>
  path.resolve(programOptions.workingDirectory, `${resource.name}.graphql`);

const omitMaxBatchSize = when(
  eq(get("maxBatchSize"), 0),
  omit(["maxBatchSize"])
);

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
      compare: compareAppSync({
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
          ]),
          assign({
            schemaFile: () => `${live.name}.graphql`,
            apiKeys: pipe([get("apiKeys"), map(pick(["description"]))]),
          }),
        ])(),
      dependencies: {
        cloudWatchLogsRole: {
          type: "Role",
          group: "IAM",
          dependencyId: ({ lives, config }) =>
            get("logConfig.cloudWatchLogsRoleArn"),
        },
      },
    },
    {
      type: "DataSource",
      Client: AppSyncDataSource,
      inferName: () => get("name"),
      omitProperties: [
        "apiId",
        "serviceRoleArn",
        "dataSourceArn",
        "relationalDatabaseConfig.rdsHttpEndpointConfig.dbClusterIdentifier",
        "relationalDatabaseConfig.rdsHttpEndpointConfig.awsSecretStoreArn",
        "relationalDatabaseConfig.rdsHttpEndpointConfig.awsRegion",
      ],
      compare: compareAppSync({
        filterAll: () => pipe([omitIfEmpty(["description"])]),
      }),
      filterLive: ({ providerConfig }) =>
        pipe([
          pick([
            "name",
            "description",
            "type",
            "dynamodbConfig",
            "elasticsearchConfig",
            "httpConfig",
            "relationalDatabaseConfig",
          ]),
          when(
            get("dynamodbConfig"),
            assign({
              dynamodbConfig: pipe([
                get("dynamodbConfig"),
                when(
                  get("awsRegion"),
                  assign({
                    awsRegion: pipe([
                      get("awsRegion"),
                      replaceRegion({ providerConfig }),
                    ]),
                  })
                ),
              ]),
            })
          ),
          when(
            get("httpConfig"),
            assign({
              httpConfig: pipe([
                get("httpConfig"),
                when(
                  get("endpoint"),
                  assign({
                    authorizationConfig: pipe([
                      get(["authorizationConfig"]),
                      assign({
                        awsIamConfig: pipe([
                          get("awsIamConfig"),
                          assign({
                            signingRegion: pipe([
                              get("signingRegion"),
                              replaceRegion({ providerConfig }),
                            ]),
                          }),
                        ]),
                      }),
                    ]),
                    endpoint: pipe([
                      get("endpoint"),
                      replaceRegion({ providerConfig }),
                    ]),
                  })
                ),
              ]),
            })
          ),
          //TODO omit elasticsearchConfig.xxx ?
        ]),
      dependencies: {
        graphqlApi: {
          type: "GraphqlApi",
          group: "AppSync",
          parent: true,
          dependencyId: findDependenciesGraphqlId,
        },
        serviceRole: {
          type: "Role",
          group: "IAM",
          dependencyId: ({ lives, config }) => get("serviceRoleArn"),
        },
        dbCluster: {
          type: "DBCluster",
          group: "RDS",
          dependencyId: ({ lives, config }) =>
            get(
              "relationalDatabaseConfig.rdsHttpEndpointConfig.dbClusterIdentifier"
            ),
        },
        lambdaFunction: {
          type: "Function",
          group: "Lambda",
          dependencyId: ({ lives, config }) =>
            get("lambdaConfig.lambdaFunctionArn"),
        },
        //TODO
        //elasticsearch => opensearch
        dynamoDbTable: {
          type: "Table",
          group: "DynamoDB",
          dependencyId: ({ lives, config }) =>
            pipe([
              get("dynamodbConfig.tableName"),
              lives.getByName({
                type: "Table",
                group: "DynamoDB",
                providerName: config.providerName,
              }),
              get("id"),
            ]),
        },
      },
    },
    {
      type: "Resolver",
      Client: AppSyncResolver,
      inferName:
        () =>
        ({ typeName, fieldName }) =>
          pipe([
            tap((params) => {
              assert(typeName);
              assert(fieldName);
            }),
            () => `resolver::${typeName}::${fieldName}`,
          ])(),
      omitProperties: ["arn", "resolverArn"],
      compare: compareAppSync({
        filterLive: () =>
          pipe([
            // TODO replace region
            omitIfEmpty([
              "description",
              "requestMappingTemplate",
              "responseMappingTemplate",
            ]),
            omitMaxBatchSize,
          ]),
      }),
      filterLive: () =>
        pipe([
          pick([
            "typeName",
            "fieldName",
            "requestMappingTemplate",
            "responseMappingTemplate",
            "kind",
            "maxBatchSize",
          ]),
          omitMaxBatchSize,
        ]),
      dependencies: {
        graphqlApi: {
          type: "GraphqlApi",
          group: "AppSync",
          parent: true,
          dependencyId: findDependenciesGraphqlId,
        },
        //TODO
        type: {
          type: "Type",
          group: "AppSync",
          dependencyId: ({ lives, config }) => get("typeName"),
        },
        dataSource: {
          type: "DataSource",
          group: "AppSync",
          dependencyId: ({ lives, config }) =>
            pipe([
              get("dataSourceName"),
              lives.getByName({
                type: "DataSource",
                group: "AppSync",
                providerName: config.providerName,
              }),
              get("id"),
            ]),
        },
      },
    },
  ],
  map(defaultsDeep({ group: GROUP, tagsKey, isOurMinion })),
]);
