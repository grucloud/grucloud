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
const { when } = require("rubico/x");

const fs = require("fs").promises;
const path = require("path");

const { compare, omitIfEmpty } = require("@grucloud/core/Common");
const { isOurMinionObject } = require("../AwsCommon");

const { AppSyncGraphqlApi } = require("./AppSyncGraphqlApi");
const { AppSyncDataSource } = require("./AppSyncDataSource");
const { AppSyncResolver } = require("./AppSyncResolver");

const GROUP = "AppSync";

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

module.exports = () =>
  map(assign({ group: () => GROUP }))([
    {
      type: "GraphqlApi",
      Client: AppSyncGraphqlApi,
      isOurMinion,
      // TODO apiKeys
      compare: compare({
        filterTarget: () =>
          pipe([
            tap((params) => {
              assert(true);
            }),
            omit(["schemaFile"]),
          ]),
        filterLive: () =>
          pipe([
            tap((params) => {
              assert(true);
            }),
            omit(["apiId", "arn", "uris", "wafWebAclArn"]),
            assign({
              apiKeys: pipe([get("apiKeys"), map(pick(["description"]))]),
            }),
            tap((params) => {
              assert(true);
            }),
          ]),
      }),
      filterLive: (input) => (live) =>
        pipe([
          tap(() => {
            assert(input);
          }),
          () => input,
          tap(writeGraphqlSchema(input)),
          () => live,
          pick([
            "authenticationType",
            "xrayEnabled",
            "wafWebAclArn",
            "logConfig",
            "apiKeys",
          ]),
          omit(["logConfig.cloudWatchLogsRoleArn"]),
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
      dependsOn: ["AppSync::GraphqlApi", "Lambda::Function"],
      dependsOnList: ["AppSync::GraphqlApi"],
      Client: AppSyncDataSource,
      isOurMinion,
      compare: compare({
        filterAll: pipe([
          omit(["apiId", "serviceRoleArn", "dataSourceArn", "tags"]),
          omitIfEmpty(["description"]),
        ]),
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
          omit([
            "httpConfig.endpoint",
            "relationalDatabaseConfig.rdsHttpEndpointConfig.dbClusterIdentifier",
            "relationalDatabaseConfig.rdsHttpEndpointConfig.awsSecretStoreArn",
            "relationalDatabaseConfig.rdsHttpEndpointConfig.awsRegion",
          ]),
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
      dependsOn: [
        "AppSync::GraphqlApi",
        "AppSync::Type",
        "AppSync::DataSource",
      ],
      dependsOnList: ["AppSync::GraphqlApi"],
      Client: AppSyncResolver,
      inferName: ({ properties }) =>
        pipe([
          tap((params) => {
            assert(properties.typeName);
            assert(properties.fieldName);
          }),
          () => `resolver::${properties.typeName}::${properties.fieldName}`,
          tap((params) => {
            assert(true);
          }),
        ])(),
      isOurMinion,
      compare: compare({
        filterTarget: () => pipe([omit(["tags"])]),
        filterLive: () =>
          pipe([
            omit(["arn", "resolverArn", "tags"]),
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
  ]);
