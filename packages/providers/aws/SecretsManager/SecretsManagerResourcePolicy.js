const assert = require("assert");
const { pipe, tap, get, assign, tryCatch } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");

const { createAwsResource } = require("../AwsClient");

const model = {
  package: "secrets-manager",
  client: "SecretsManager",
  ignoreErrorCodes: ["ResourceNotFoundException"],
  getById: { method: "getResourcePolicy" },
  create: { method: "putResourcePolicy" },
  destroy: {
    method: "deleteResourcePolicy",
  },
};

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SecretsManager.html
exports.SecretsManagerResourcePolicy = ({ spec, config }) =>
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
      ({ Name }) => ({ SecretId: Name }),
    ]),
    findId: pipe([get("live.ARN")]),
    decorateList: ({ endpoint, getById }) =>
      pipe([
        tap((params) => {
          assert(true);
        }),
      ]),
    decorate: ({ endpoint }) =>
      pipe([
        tap((params) => {
          assert(endpoint);
        }),
        //assign({}),
      ]),
    getByName: getByNameCore,
    configDefault: ({ name, namespace, properties: { Tags, ...otherProps } }) =>
      pipe([
        () => otherProps,
        defaultsDeep({
          Name: name,
        }),
      ])(),
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
            parent: { type: "Secret", group: "SecretsManager" },
            pickKey: pipe([
              tap(({ Name }) => {
                assert(Name);
              }),
              ({ Name }) => ({ SecretId: Name }),
            ]),
            method: "getResourcePolicy",
            decorate: ({ lives, parent: { Name } }) =>
              pipe([
                tap((params) => {
                  assert(true);
                }),
                defaultsDeep({ Name }),
              ]),
            config,
          }),
        tap((params) => {
          assert(true);
        }),
      ])(),
  });
