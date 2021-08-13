const { assign, map } = require("rubico");
const { isOurMinionObject } = require("../AwsCommon");

const { AppSyncGraphqlApi } = require("./AppSyncGraphqlApi");
const { AppSyncApiKey } = require("./AppSyncApiKey");

const GROUP = "appSync";

const isOurMinion = ({ live, config }) =>
  isOurMinionObject({ tags: live.tags, config });

module.exports = () =>
  map(assign({ group: () => GROUP }))([
    {
      type: "GraphqlApi",
      Client: AppSyncGraphqlApi,
      isOurMinion,
    },
    {
      type: "ApiKey",
      dependsOn: ["appSync::GraphqlApi"],
      Client: AppSyncApiKey,
      isOurMinion,
    },
  ]);
