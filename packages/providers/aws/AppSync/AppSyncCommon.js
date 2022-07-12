const assert = require("assert");
const { pipe, get, tap, filter, eq } = require("rubico");
const { find } = require("rubico/x");

const { createEndpoint } = require("../AwsCommon");

exports.createAppSync = createEndpoint("appsync", "AppSync");

exports.ignoreErrorCodes = ["NotFoundException"];

exports.findDependenciesGraphqlApi = ({ live, lives, config }) => ({
  type: "GraphqlApi",
  group: "AppSync",
  ids: [
    pipe([
      tap(() => {
        assert(live.apiId);
      }),
      () =>
        lives.getByType({
          type: "GraphqlApi",
          group: "AppSync",
          providerName: config.providerName,
        }),
      tap((param) => {
        assert(true);
      }),
      find(eq(get("live.apiId"), live.apiId)),
      tap((param) => {
        assert(true);
      }),
      get("id"),
      tap((param) => {
        assert(true);
      }),
    ])(),
  ],
});

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppSync.html#tagResource-property
exports.tagResource =
  ({ appSync, property }) =>
  ({ live }) =>
    pipe([
      tap((params) => {
        assert(live[property]);
      }),
      (tags) => ({ resourceArn: live[property], tags }),
      appSync().tagResource,
    ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppSync.html#untagResource-property
exports.untagResource =
  ({ appSync, property }) =>
  ({ live }) =>
    pipe([
      tap((params) => {
        assert(live[property]);
      }),
      (tagKeys) => ({ resourceArn: live[property], tagKeys }),
      appSync().untagResource,
    ]);
