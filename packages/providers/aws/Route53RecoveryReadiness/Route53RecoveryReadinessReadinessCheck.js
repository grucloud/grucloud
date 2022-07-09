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
        getById,
        tap((params) => {
          assert(true);
        }),
      ]),
    findDependencies: ({ live, lives }) => [
      {
        type: "ResourceSet",
        group: "Route53RecoveryReadiness",
        ids: [
          pipe([
            () =>
              lives.getByName({
                name: live.ResourceSetName,
                type: "ResourceSet",
                group: "Route53RecoveryReadiness",
                config: config.providerName,
              }),
            get("name"),
          ])(),
        ],
      },
    ],
    tagResource: tagResource,
    untagResource: untagResource,
    configDefault: ({
      name,
      namespace,
      properties: { Tags, ...otherProps },
      dependecies: { resourceSet },
    }) =>
      pipe([
        () => otherProps,
        defaultsDeep({
          ReadinessCheckName: name,
          ResourceSetName: getField(resourceSet, "ResourceSetName"),
          Tags: buildTagsObject({ name, config, namespace, userTags: Tags }),
        }),
      ])(),
  });
