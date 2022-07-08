const assert = require("assert");
const { pipe, map, tap, get, pick, assign } = require("rubico");
const { defaultsDeep, when } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { tagResource, untagResource } = require("./CodeStarConnectionsCommon");
const { buildTags } = require("../AwsCommon");
const { createAwsResource } = require("../AwsClient");

const pickId = pick(["ConnectionArn"]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodeStarconnections.html#listTagsForResource-property
const assignTags = ({ endpoint }) =>
  pipe([
    assign({
      tags: pipe([
        ({ ConnectionArn }) => ({ ResourceArn: ConnectionArn }),
        endpoint().listTagsForResource,
        get("Tags"),
      ]),
    }),
  ]);

const model = ({ config }) => ({
  package: "codestar-connections",
  client: "CodeStarConnections",
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodeStarconnections.html#getConnection-property
  getById: {
    method: "getConnection",
    pickId: pickId,
    getField: "Connection",
    decorate: ({ endpoint }) => pipe([assignTags({ endpoint })]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodeStarconnections.html#listConnections-property
  getList: {
    method: "listConnections",
    getParam: "Connections",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodeStarconnections.html#createConnection-property
  create: {
    method: "createConnection",
    pickCreated: ({ payload }) => pickId,
    postCreate:
      ({ endpoint, payload: { tags } }) =>
      ({ ConnectionArn }) =>
        pipe([
          tap((params) => {
            assert(true);
          }),
          () => ({ ResourceArn: ConnectionArn, Tags: tags }),
          endpoint().tagResource,
        ])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodeStarconnections.html#deleteConnection-property
  destroy: { method: "deleteConnection", pickId },
});

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodeStarconnections.html
exports.CodeStarConnectionsConnection = ({ spec, config }) =>
  createAwsResource({
    model: model({ config }),
    spec,
    config,
    findName: pipe([get("live.ConnectionName")]),
    findId: pipe([get("live.ConnectionArn")]),
    getByName: getByNameCore,
    tagResource: tagResource({ property: "ConnectionArn" }),
    untagResource: untagResource({ property: "ConnectionArn" }),
    configDefault: ({
      name,
      namespace,
      properties: { tags, ...otherProps },
      dependencies: { host },
    }) =>
      pipe([
        () => otherProps,
        defaultsDeep({
          tags: buildTags({
            name,
            config,
            namespace,
            UserTags: tags,
          }),
        }),
        //TODO
        //when(() => host, defaultsDeep({})),
      ])(),
  });
