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
  pick(["RecoveryGroupName"]),
  tap(({ RecoveryGroupName }) => {
    assert(RecoveryGroupName);
  }),
]);

const model = ({ config }) => ({
  package: "route53-recovery-readiness",
  client: "Route53RecoveryReadiness",
  region: "us-west-2",
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53RecoveryReadiness.html#getRecoveryGroup-property
  getById: {
    method: "getRecoveryGroup",
    pickId,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53RecoveryReadiness.html#listRecoveryGroups-property
  getList: {
    method: "listRecoveryGroups",
    getParam: "RecoveryGroups",
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53RecoveryReadiness.html#createRecoveryGroup-property
  create: {
    method: "createRecoveryGroup",
    pickCreated: ({ payload }) =>
      pipe([
        tap((params) => {
          assert(true);
        }),
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53RecoveryReadiness.html#updateRecoveryGroup-property
  update: {
    method: "updateRecoveryGroup",
    filterParams: ({ payload, live }) =>
      pipe([() => payload, omit(["Tags"])])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53RecoveryReadiness.html#deleteRecoveryGroup-property
  destroy: { method: "deleteRecoveryGroup", pickId },
});

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53RecoveryReadiness.html
exports.Route53RecoveryReadinessRecoveryGroup = ({ spec, config }) =>
  createAwsResource({
    model: model({ config }),
    spec,
    config,
    findName: pipe([get("live.RecoveryGroupName")]),
    findId: pipe([get("live.RecoveryGroupArn")]),
    getByName: ({ getList, endpoint, getById }) =>
      pipe([({ name }) => ({ RecoveryGroupName: name }), getById({})]),
    tagResource: tagResource,
    untagResource: untagResource,
    configDefault: ({
      name,
      namespace,
      properties: { Tags, ...otherProps },
      dependencies: { cells },
    }) =>
      pipe([
        () => otherProps,
        defaultsDeep({
          Tags: buildTagsObject({ name, config, namespace, userTags: Tags }),
          Cells: pipe([
            () => cells,
            map((cell) => getField(cell, "CellArn")),
          ])(),
        }),
      ])(),
  });
