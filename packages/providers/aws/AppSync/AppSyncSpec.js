const assert = require("assert");
const { map, pipe, tap } = require("rubico");
const { defaultsDeep } = require("rubico/x");

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

module.exports = pipe([
  () => [
    createAwsService(AppSyncDataSource({ compare })),
    createAwsService(AppSyncFunction({})),
    createAwsService(AppSyncGraphqlApi({ compare })),
    createAwsService(AppSyncResolver({ compare })),
  ],
  map(
    defaultsDeep({ group: GROUP, tagsKey, isOurMinion, compare: compare({}) })
  ),
]);
