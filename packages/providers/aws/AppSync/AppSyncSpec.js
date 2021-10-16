const assert = require("assert");
const { assign, map, pick, pipe, tap, omit, get } = require("rubico");
const { compare, omitIfEmpty } = require("@grucloud/core/Common");
const { isOurMinionObject } = require("../AwsCommon");

const { AppSyncGraphqlApi } = require("./AppSyncGraphqlApi");
const { AppSyncDataSource } = require("./AppSyncDataSource");
const { AppSyncResolver } = require("./AppSyncResolver");

const GROUP = "AppSync";

const isOurMinion = ({ live, config }) =>
  isOurMinionObject({ tags: live.tags, config });

module.exports = () =>
  map(assign({ group: () => GROUP }))([
    {
      type: "GraphqlApi",
      Client: AppSyncGraphqlApi,
      isOurMinion,
      // TODO apiKeys
      compare: compare({
        filterTarget: pipe([
          tap((params) => {
            assert(true);
          }),
          omit(["schemaFile"]),
        ]),
        filterLive: pipe([
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
    },
    {
      type: "DataSource",
      dependsOn: ["AppSync::GraphqlApi", "Lambda::Function"],
      Client: AppSyncDataSource,
      isOurMinion,
      compare: compare({
        filterAll: pipe([
          omit(["apiId", "serviceRoleArn", "dataSourceArn", "tags"]),
          omitIfEmpty(["description"]),
        ]),
      }),
    },
    {
      type: "Resolver",
      dependsOn: [
        "AppSync::GraphqlApi",
        "AppSync::Type",
        "AppSync::DataSource",
      ],
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
        filterTarget: pipe([omit(["tags"])]),
        filterLive: pipe([
          omit(["arn", "resolverArn", "tags"]),
          omitIfEmpty([
            "description",
            "requestMappingTemplate",
            "responseMappingTemplate",
          ]),
        ]),
      }),
    },
  ]);
