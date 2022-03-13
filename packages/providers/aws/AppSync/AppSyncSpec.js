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
const { compareAws, isOurMinionObject } = require("../AwsCommon");

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
          pick(["authenticationType", "xrayEnabled", "logConfig", "apiKeys"]),
          assign({
            schemaFile: () => `${live.name}.graphql`,
            apiKeys: pipe([get("apiKeys"), map(pick(["description"]))]),
          }),
        ])(),
      dependencies: {
        cloudWatchLogsRole: { type: "Role", group: "IAM" },
      },
    },
    {
      type: "DataSource",
      Client: AppSyncDataSource,
      omitProperties: [
        "apiId",
        "serviceRoleArn",
        "dataSourceArn",
        "httpConfig.endpoint",
        "relationalDatabaseConfig.rdsHttpEndpointConfig.dbClusterIdentifier",
        "relationalDatabaseConfig.rdsHttpEndpointConfig.awsSecretStoreArn",
        "relationalDatabaseConfig.rdsHttpEndpointConfig.awsRegion",
      ],
      compare: compareAppSync({
        filterAll: () => pipe([omitIfEmpty(["description"])]),
      }),
      filterLive: () =>
        pipe([
          pick([
            "description",
            "type",
            "dynamodbConfig",
            "elasticsearchConfig",
            "httpConfig",
            "relationalDatabaseConfig",
          ]),
          //TODO omit elasticsearchConfig.xxx ?
        ]),
      dependencies: {
        graphqlApi: { type: "GraphqlApi", group: "AppSync", parent: true },
        serviceRole: { type: "Role", group: "IAM" },
        dbCluster: { type: "DBCluster", group: "RDS" },
        lambdaFunction: { type: "Function", group: "Lambda" },
        //TODO
        //elasticsearch => opensearch
        dynamoDbTable: { type: "Table", group: "DynamoDB" },
      },
    },
    {
      type: "Resolver",
      Client: AppSyncResolver,
      inferName: ({ properties }) =>
        pipe([
          tap((params) => {
            assert(properties.typeName);
            assert(properties.fieldName);
          }),
          () => `resolver::${properties.typeName}::${properties.fieldName}`,
        ])(),
      omitProperties: ["arn", "resolverArn"],
      compare: compareAppSync({
        filterLive: () =>
          pipe([
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
        graphqlApi: { type: "GraphqlApi", group: "AppSync", parent: true },
        type: { type: "Type", group: "AppSync" },
        dataSource: { type: "DataSource", group: "AppSync" },
        dynamoDbTable: { type: "Table", group: "DynamoDB" },
      },
    },
  ],
  map(defaultsDeep({ group: GROUP, tagsKey, isOurMinion })),
]);
