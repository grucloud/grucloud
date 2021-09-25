const assert = require("assert");
const { assign, map, pick, pipe, tap, omit } = require("rubico");
const { compare, omitIfEmpty } = require("@grucloud/core/Common");
const { isOurMinionObject } = require("../AwsCommon");

const { AppSyncGraphqlApi } = require("./AppSyncGraphqlApi");
const { AppSyncApiKey } = require("./AppSyncApiKey");
const { AppSyncDataSource } = require("./AppSyncDataSource");
const { AppSyncType } = require("./AppSyncType");
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
      compare: compare({
        filterLive: pipe([omit(["apiId", "arn", "uris", "wafWebAclArn"])]),
      }),
    },
    {
      type: "ApiKey",
      dependsOn: ["AppSync::GraphqlApi"],
      Client: AppSyncApiKey,
      isOurMinion,
      compare: compare({
        filterAll: pipe([
          omit(["apiId", "id", "expires", "deletes"]),
          omitIfEmpty(["description"]),
        ]),
      }),
    },
    {
      type: "DataSource",
      dependsOn: ["AppSync::GraphqlApi"],
      Client: AppSyncDataSource,
      isOurMinion,
      compare: compare({
        filterAll: pipe([
          omit(["apiId", "serviceRoleArn", "dataSourceArn", "tags"]),
        ]),
      }),
    },
    {
      type: "Type",
      dependsOn: ["AppSync::GraphqlApi"],
      Client: AppSyncType,
      isOurMinion,
      compare: compare({
        filterTarget: pipe([
          tap((params) => {
            assert(true);
          }),
        ]),
        filterLive: pipe([
          tap((params) => {
            assert(true);
          }),
          omit(["arn", "name", "tags"]),
          omitIfEmpty(["description"]),
        ]),
      }),
    },
    {
      type: "Resolver",
      dependsOn: ["AppSync::GraphqlApi", "AppSync::Type", "DynamoDB::Table"],
      Client: AppSyncResolver,
      isOurMinion,
      compare: compare({
        filterTarget: pipe([omit(["tags"])]),
        filterLive: pipe([
          omit(["apiId", "arn", "tags"]),
          omitIfEmpty(["description"]),
        ]),
      }),
    },
  ]);
