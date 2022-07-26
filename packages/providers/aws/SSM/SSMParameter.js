const assert = require("assert");
const { pipe, tap, get, pick, assign, omit } = require("rubico");
const { defaultsDeep, when } = require("rubico/x");
const { getField } = require("@grucloud/core/ProviderCommon");

const { buildTags } = require("../AwsCommon");
const { createAwsResource } = require("../AwsClient");
const { tagResource, untagResource } = require("./SSMCommon");

const pickId = pipe([pick(["Name"])]);

const decorate =
  ({ endpoint }) =>
  (live) =>
    pipe([
      () => live,
      pick(["Name"]),
      defaultsDeep({ WithDecryption: true }),
      endpoint().getParameter,
      get("Parameter"),
      defaultsDeep(live),
      assign({
        Tags: pipe([
          ({ Name }) => ({
            ResourceId: Name,
            ResourceType: "Parameter",
          }),
          endpoint().listTagsForResource,
          get("TagList"),
        ]),
      }),
    ])();

const model = {
  package: "ssm",
  client: "SSM",
  ignoreErrorCodes: ["ParameterNotFound"],
  getById: {
    method: "describeParameters",
    getField: "Parameters",
    pickId: pipe([
      ({ Name }) => ({ Filters: [{ Key: "Name", Values: [Name] }] }),
    ]),
    decorate,
  },
  getList: {
    method: "describeParameters",
    getParam: "Parameters",
    decorate,
  },
  create: {
    method: "putParameter",
    pickCreated:
      ({ payload }) =>
      () =>
        payload,
  },
  update: {
    method: "putParameter",
    extraParam: { Overwrite: true },
    filterParams: ({ pickId, payload, live }) =>
      pipe([
        () => payload,
        tap((params) => {
          assert(pickId);
        }),
        omit(["Tags"]),
        tap((params) => {
          assert(true);
        }),
      ])(),
  },
  destroy: { method: "deleteParameter", pickId },
};

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SSM.html
exports.SSMParameter = ({ spec, config }) =>
  createAwsResource({
    model,
    spec,
    config,
    findName: get("live.Name"),
    findId: pipe([
      get("live.ARN"),
      tap((ARN) => {
        assert(ARN);
      }),
    ]),
    getByName: ({ getById }) =>
      pipe([
        ({ name }) => ({ Name: name }),
        getById,
        tap((params) => {
          assert(true);
        }),
      ]),
    tagResource: tagResource({ ResourceType: "Parameter" }),
    untagResource: untagResource({ ResourceType: "Parameter" }),
    configDefault: ({
      name,
      namespace,
      properties: { Tags, ...otherProps },
      dependencies: { kmsKey },
    }) =>
      pipe([
        () => otherProps,
        defaultsDeep({
          Name: name,
          Tags: buildTags({ name, config, namespace, UserTags: Tags }),
        }),
        when(() => kmsKey, defaultsDeep({ KeyId: getField(kmsKey, "Arn") })),
      ])(),
  });
