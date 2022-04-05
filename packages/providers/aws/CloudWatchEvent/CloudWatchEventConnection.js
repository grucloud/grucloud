const assert = require("assert");
const { pipe, tap, get, assign, pick } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");

const { createAwsResource } = require("../AwsClient");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchEvents.html

const model = {
  package: "cloudwatch-events",
  client: "CloudWatchEvents",
  ignoreErrorCodes: ["ResourceNotFoundException"],
  getById: { method: "describeConnection" },
  getList: { method: "listConnections", getParam: "Connections" },
  create: { method: "createConnection" },
  update: { method: "updateConnection" },
  destroy: { method: "deleteConnection" },
};

exports.CloudWatchEventConnection = ({ spec, config }) =>
  createAwsResource({
    model,
    spec,
    config,
    findName: pipe([
      tap((params) => {
        assert(true);
      }),
      get("live.Name"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
    pickId: pipe([
      tap(({ Name }) => {
        assert(Name);
      }),
      pick(["Name"]),
    ]),
    findId: get("live.ConnectionArn"),
    findDependencies: ({ live }) => [
      {
        type: "Secret",
        group: "SecretsManager",
        ids: [pipe([() => live, get("SecretArn")])()],
      },
    ],
    decorate: ({ endpoint }) =>
      pipe([
        tap((params) => {
          assert(true);
        }),
        assign({}),
      ]),
    getByName: getByNameCore,
    configDefault: ({ name, namespace, properties: { Tags, ...otherProps } }) =>
      pipe([
        () => otherProps,
        defaultsDeep({
          Name: name,
        }),
      ])(),
    pickCreated:
      ({ payload }) =>
      () =>
        payload,
    updateFilterParams: ({ payload }) =>
      pipe([
        tap((params) => {
          assert(true);
        }),
        () => payload,
      ]),
  });
