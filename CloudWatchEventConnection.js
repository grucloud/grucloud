const assert = require("assert");
const {
  pipe,
  tap,
  get,
  assign,
  tryCatch,
  switchCase,
  pick,
} = require("rubico");
const { defaultsDeep, when } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");

const { buildTags, isAwsError } = require("../AwsCommon");
const { createAwsResource } = require("../AwsClient");
const { tagResource, untagResource } = require("./CloudWatchEventCommon");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchEvents.html

const model = {
  package: "cloudwatch-events",
  client: "CloudWatchEvents",
  pickIds: ["ARN"],
  ignoreErrorCodes: ["ResourceNotFoundException"],
  getById: { method: "getConnectionValue" },
  getList: { method: "listConnections", getParam: "ConnectionList" },
  update: { method: "putConnectionValue" },
  destroy: {
    method: "deleteConnection",
    ignoreErrorMessages: [
      "You can't perform this operation on the Connection because it was marked for deletion",
    ],
  },
};

exports.CloudWatchEventConnection = ({ spec, config }) =>
  createAwsResource({
    model,
    spec,
    config,
    findName: pipe([
      get("live.Name"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
    pickId: pipe([
      tap(({ Name }) => {
        assert(Name);
      }),
      ({ Name }) => ({ ConnectionId: Name }),
    ]),
    findId: pipe([get("live.ARN")]),
    findDependencies: ({ live }) => [
      { type: "Key", group: "KMS", ids: [live.KmsKeyId] },
    ],
    decorateList:
      ({ endpoint, getById }) =>
      (live) =>
        pipe([
          () => live,
          getConnectionValue({ endpoint }),
          defaultsDeep(live),
        ])(),
    decorate: ({ endpoint }) => pipe([assign({})]),
    getByName: getByNameCore,
    tagResource: tagResource,
    untagResource: untagResource,
    configDefault: ({ name, namespace, properties: { Tags, ...otherProps } }) =>
      pipe([
        () => otherProps,
        defaultsDeep({
          Name: name,
          Tags: buildTags({ name, config, namespace, UserTags: Tags }),
        }),
      ])(),
    create:
      ({ endpoint, getById }) =>
      ({ payload }) =>
        tryCatch(
          pipe([
            () => payload,
            when(
              get("ConnectionString"),
              assign({
                ConnectionString: pipe([
                  get("ConnectionString"),
                  JSON.stringify,
                ]),
              })
            ),
            endpoint().createConnection,
          ]),
          switchCase([
            isAwsError("InvalidRequestException"),
            pipe([
              () => ({ ConnectionId: payload.Name }),
              endpoint().restoreConnection,
              ({ Name }) => ({
                ConnectionId: Name,
              }),
              defaultsDeep(
                pipe([
                  () => payload,
                  pick(["ConnectionString", "ConnectionBinary"]),
                  assign({
                    ConnectionString: pipe([
                      get("ConnectionString"),
                      JSON.stringify,
                    ]),
                  }),
                ])()
              ),
              endpoint().putConnectionValue,
            ]),
            (error) => {
              throw error;
            },
          ])
        )(),
    updateFilterParams: ({ payload }) => pipe([() => payload]),
  });
