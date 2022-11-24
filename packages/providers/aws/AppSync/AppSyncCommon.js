const assert = require("assert");
const { pipe, get, tap, filter, eq } = require("rubico");
const { find } = require("rubico/x");

const { createEndpoint } = require("../AwsCommon");

const { createTagger } = require("../AwsTagger");

exports.Tagger = createTagger({
  methodTagResource: "tagResource",
  methodUnTagResource: "untagResource",
  ResourceArn: "resourceArn",
  TagsKey: "tags",
  UnTagsKey: "tagKeys",
});

exports.createAppSync = createEndpoint("appsync", "AppSync");

exports.ignoreErrorCodes = ["NotFoundException"];

exports.findDependenciesGraphqlId =
  ({ lives, config }) =>
  (live) =>
    pipe([
      tap(() => {
        assert(live.apiId);
      }),
      lives.getByType({
        type: "GraphqlApi",
        group: "AppSync",
        providerName: config.providerName,
      }),
      find(eq(get("live.apiId"), live.apiId)),
      get("id"),
    ])();

exports.findDependenciesGraphqlApi = ({ live, lives, config }) => ({
  type: "GraphqlApi",
  group: "AppSync",
  ids: [
    pipe([
      tap(() => {
        assert(live.apiId);
      }),
      lives.getByType({
        type: "GraphqlApi",
        group: "AppSync",
        providerName: config.providerName,
      }),
      find(eq(get("live.apiId"), live.apiId)),
      get("id"),
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
