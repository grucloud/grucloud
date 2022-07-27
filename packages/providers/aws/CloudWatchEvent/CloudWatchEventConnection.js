const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");

const { createAwsResource } = require("../AwsClient");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchEvents.html
const pickId = pipe([pick(["Name"])]);

const model = {
  package: "cloudwatch-events",
  client: "CloudWatchEvents",
  ignoreErrorCodes: ["ResourceNotFoundException"],
  getById: {
    method: "describeConnection",
    pickId,
  },
  getList: {
    method: "listConnections",
    getParam: "Connections",
    decorate: ({ getById }) => getById,
  },
  create: {
    method: "createConnection",
    pickCreated:
      ({ payload }) =>
      () =>
        payload,
  },
  update: {
    method: "updateConnection",
    filterParams: ({ payload }) =>
      pipe([
        tap((params) => {
          assert(true);
        }),
        () => payload,
      ]),
  },
  destroy: { method: "deleteConnection", pickId },
};

exports.CloudWatchEventConnection = ({ spec, config }) =>
  createAwsResource({
    model,
    spec,
    config,
    findName: pipe([get("live.Name")]),
    findId: get("live.ConnectionArn"),
    getByName: getByNameCore,
    configDefault: ({ name, namespace, properties: { Tags, ...otherProps } }) =>
      pipe([
        () => otherProps,
        defaultsDeep({
          Name: name,
        }),
      ])(),
  });
