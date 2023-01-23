const assert = require("assert");
const { pipe, tap, get, assign, pick } = require("rubico");
const { defaultsDeep, when } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");

const { getField } = require("@grucloud/core/ProviderCommon");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchEvents.html
const pickId = pipe([pick(["Name"])]);

exports.CloudWatchEventApiDestination = ({}) => ({
  type: "ApiDestination",
  package: "cloudwatch-events",
  client: "CloudWatchEvents",
  inferName: () => get("Name"),
  findName: () => pipe([get("Name")]),
  findId: () => get("ApiDestinationArn"),
  dependencies: {
    connection: {
      type: "Connection",
      group: "CloudWatchEvents",
      parent: true,
      dependencyId: ({ lives, config }) => get("ConnectionArn"),
    },
  },
  omitProperties: [
    "ConnectionArn",
    "ApiDestinationArn",
    "ApiDestinationState",
    "CreationTime",
    "LastModifiedTime",
  ],
  getByName: getByNameCore,
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      tap((params) => {
        assert(client);
        assert(endpoint);
        assert(getById);
        assert(config);
      }),
      () =>
        client.getListWithParent({
          parent: { type: "Connection", group: "CloudWatchEvents" },
          pickKey: pipe([pick(["ConnectionArn"])]),
          method: "listApiDestinations",
          getParam: "ApiDestinations",
          config,
        }),
    ])(),
  ignoreErrorCodes: ["ResourceNotFoundException"],
  getById: {
    method: "describeApiDestination",
    pickId,
  },
  getList: {
    method: "listApiDestinations",
    getParam: "ApiDestinations",
  },
  create: {
    method: "createApiDestination",
    pickCreated:
      ({ payload }) =>
      () =>
        payload,
  },
  update: { method: "updateApiDestination" },
  destroy: { method: "deleteApiDestination", pickId },
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { connection },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(connection);
      }),
      () => otherProps,
      defaultsDeep({
        Name: name,
        ConnectionArn: getField(connection, "ConnectionArn"),
      }),
    ])(),
});
