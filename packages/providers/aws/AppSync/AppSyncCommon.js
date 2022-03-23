const assert = require("assert");
const { pipe, get, eq, tap } = require("rubico");
const { find } = require("rubico/x");

const { createEndpoint } = require("../AwsCommon");

exports.createAppSync = createEndpoint("appsync", "AppSync");

exports.ignoreErrorCodes = ["NotFoundException"];

exports.findDependenciesGraphqlApi = ({ live, lives, config }) => ({
  type: "GraphqlApi",
  group: "AppSync",
  ids: [
    pipe([
      () =>
        lives.getByType({
          type: "GraphqlApi",
          group: "AppSync",
          providerName: config.providerName,
        }),
      tap((params) => {
        assert(true);
      }),
      find(eq(get("live.apiId"), live.apiId)),
      get("id"),
      tap((params) => {
        assert(true);
      }),
    ])(),
  ],
});

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppSync.html#tagResource-property
exports.tagResource =
  ({ appSync }) =>
  ({ live, id }) =>
    pipe([(tags) => ({ resourceArn: id, tags }), appSync().tagResource]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppSync.html#untagResource-property
exports.untagResource =
  ({ appSync }) =>
  ({ live, id }) =>
    pipe([
      (tagKeys) => ({ resourceArn: id, tagKeys }),
      appSync().untagResource,
    ]);
