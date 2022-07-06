const assert = require("assert");
const { pipe, get, tap } = require("rubico");

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
      () => live.apiId,
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
