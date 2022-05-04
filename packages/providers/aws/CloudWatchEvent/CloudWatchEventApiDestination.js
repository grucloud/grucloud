const assert = require("assert");
const { pipe, tap, get, assign, pick } = require("rubico");
const { defaultsDeep, when } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");

const { createAwsResource } = require("../AwsClient");
const { getField } = require("@grucloud/core/ProviderCommon");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchEvents.html

const model = {
  package: "cloudwatch-events",
  client: "CloudWatchEvents",
  ignoreErrorCodes: ["ResourceNotFoundException"],
  getById: { method: "describeApiDestination" },
  getList: { method: "listApiDestinations", getParam: "ApiDestinations" },
  create: { method: "createApiDestination" },
  update: { method: "updateApiDestination" },
  destroy: { method: "deleteApiDestination" },
};

exports.CloudWatchEventApiDestination = ({ spec, config }) =>
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
      pick(["Name"]),
    ]),
    findId: get("live.ApiDestinationArn"),
    findDependencies: ({ live }) => [
      {
        type: "Connection",
        group: "CloudWatchEvents",
        ids: [
          pipe([
            tap((params) => {
              assert(true);
            }),
            () => live,
            get("ConnectionArn"),
          ])(),
        ],
      },
    ],
    decorateList: ({ endpoint, getById }) =>
      pipe([
        tap((params) => {
          assert(true);
        }),
      ]),
    decorate: ({ endpoint }) =>
      pipe([
        tap((params) => {
          assert(true);
        }),
        assign({}),
      ]),
    getByName: getByNameCore,
    pickCreated:
      ({ payload }) =>
      () =>
        payload,
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
            pickKey: pipe([
              tap(({ ConnectionArn }) => {
                assert(ConnectionArn);
              }),
              pick(["ConnectionArn"]),
            ]),
            method: "listApiDestinations",
            getParam: "ApiDestinations",
            decorate: ({ lives, parent }) =>
              pipe([
                tap((params) => {
                  assert(true);
                }),
                defaultsDeep({}),
              ]),
            config,
          }),
        tap((params) => {
          assert(true);
        }),
      ])(),
    configDefault: ({
      name,
      namespace,
      properties: { Tags, ...otherProps },
      dependencies: { connection },
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
