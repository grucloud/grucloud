const { AppSync } = require("@aws-sdk/client-appsync");
const { createEndpoint } = require("../AwsCommon");

exports.createAppSync = createEndpoint(AppSync);

exports.ignoreErrorCodes = ["NotFoundException"];

exports.findDependenciesGraphqlApi = ({ live, lives }) => ({
  type: "GraphqlApi",
  group: "AppSync",
  ids: [live.apiId],
});
