const assert = require("assert");
const { pipe, tap, get, omit, pick, map } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { buildTagsObject } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const { createAwsResource } = require("../AwsClient");
const {
  tagResource,
  untagResource,
} = require("./Route53RecoveryReadinessCommon");

const pickId = pipe([
  pick(["ReadinessCheckName"]),
  tap(({ ReadinessCheckName }) => {
    assert(ReadinessCheckName);
  }),
]);

const model = ({ config }) => ({
  package: "route53-recovery-readiness",
  client: "Route53RecoveryReadiness",
  region: "us-west-2",
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53RecoveryReadiness.html#getReadinessCheck-property
  getById: {
    method: "getReadinessCheck",
    pickId,
    decorate: () =>
      pipe([
        ({ ResourceSet, ...other }) => ({
          ResourceSetName: ResourceSet,
          ...other,
        }),
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53RecoveryReadiness.html#listReadinessChecks-property
  getList: {
    method: "listReadinessChecks",
    getParam: "ReadinessChecks",
    decorate: ({ getById }) =>
      pipe([
        tap((param) => {
          assert(true);
        }),
        getById,
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53RecoveryReadiness.html#createReadinessCheck-property
  create: {
    method: "createReadinessCheck",
    pickCreated: ({ payload }) =>
      pipe([
        tap((params) => {
          assert(true);
        }),
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53RecoveryReadiness.html#updateReadinessCheck-property
  update: {
    method: "updateReadinessCheck",
    filterParams: ({ payload, live }) =>
      pipe([() => payload, omit(["Tags"])])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53RecoveryReadiness.html#deleteReadinessCheck-property
  destroy: { method: "deleteReadinessCheck", pickId },
});

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53RecoveryReadiness.html
exports.Route53RecoveryReadinessReadinessCheck = ({ spec, config }) =>
  createAwsResource({
    model: model({ config }),
    spec,
    config,
    findName: pipe([get("live.ReadinessCheckName")]),
    findId: pipe([get("live.ReadinessCheckArn")]),
    getByName: ({ getList, endpoint, getById }) =>
      pipe([
        ({ name }) => ({ ReadinessCheckName: name }),
        getById({}),
        tap((params) => {
          assert(true);
        }),
      ]),
    tagResource: tagResource,
    untagResource: untagResource,
    configDefault: ({
      name,
      namespace,
      properties: { Tags, ...otherProps },
      dependencies: { resourceSet },
    }) =>
      pipe([
        tap((params) => {
          assert(resourceSet);
        }),
        () => otherProps,
        defaultsDeep({
          ResourceSetName: getField(resourceSet, "ResourceSetName"),
          Tags: buildTagsObject({ name, config, namespace, userTags: Tags }),
        }),
      ])(),
  });
