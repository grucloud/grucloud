const assert = require("assert");
const { pipe, tap, get, omit, pick, map } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { buildTagsObject } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const { Tagger } = require("./Route53RecoveryReadinessCommon");

const pickId = pipe([
  pick(["ReadinessCheckName"]),
  tap(({ ReadinessCheckName }) => {
    assert(ReadinessCheckName);
  }),
]);

const buildArn = () =>
  pipe([
    get("ReadinessCheckArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53RecoveryReadiness.html
exports.Route53RecoveryReadinessReadinessCheck = ({}) => ({
  type: "ReadinessCheck",
  package: "route53-recovery-readiness",
  client: "Route53RecoveryReadiness",
  region: "us-west-2",
  inferName: () => pipe([get("ReadinessCheckName")]),
  findName: () => pipe([get("ReadinessCheckName")]),
  findId: () => pipe([get("ReadinessCheckArn")]),
  ignoreErrorCodes: ["ResourceNotFoundException"],
  dependencies: {
    resourceSet: {
      type: "ResourceSet",
      group: "Route53RecoveryReadiness",
      dependencyId: ({ lives, config }) =>
        pipe([
          tap((live) => {
            assert(live.ResourceSetName);
          }),
          get("ResourceSetName"),
          lives.getByName({
            type: "ResourceSet",
            group: "Route53RecoveryReadiness",
            config: config.providerName,
          }),
          get("id"),
          tap((id) => {
            assert(id);
          }),
        ]),
    },
  },
  omitProperties: ["ReadinessCheckArn", "ResourceSetName"],
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
  getByName: ({ getList, endpoint, getById }) =>
    pipe([
      ({ name }) => ({ ReadinessCheckName: name }),
      getById({}),
      tap((params) => {
        assert(true);
      }),
    ]),
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { resourceSet },
    config,
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
