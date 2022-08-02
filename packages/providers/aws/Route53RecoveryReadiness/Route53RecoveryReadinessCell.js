const assert = require("assert");
const { pipe, tap, get, omit, pick, assign, map } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { buildTagsObject } = require("@grucloud/core/Common");

const { createAwsResource } = require("../AwsClient");
const {
  tagResource,
  untagResource,
} = require("./Route53RecoveryReadinessCommon");
const { getField } = require("../../../core/ProviderCommon");

const pickId = pipe([pick(["CellName"])]);

const model = ({ config }) => ({
  package: "route53-recovery-readiness",
  client: "Route53RecoveryReadiness",
  region: "us-west-2",
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53RecoveryReadiness.html#getCell-property
  getById: {
    method: "getCell",
    pickId,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53RecoveryReadiness.html#listCells-property
  getList: {
    method: "listCells",
    getParam: "Cells",
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53RecoveryReadiness.html#createCell-property
  create: {
    method: "createCell",
    pickCreated: ({ payload }) =>
      pipe([
        tap((params) => {
          assert(true);
        }),
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53RecoveryReadiness.html#updateCell-property
  update: {
    method: "updateCell",
    filterParams: ({ payload, live }) =>
      pipe([() => payload, omit(["Tags"])])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53RecoveryReadiness.html#deleteCell-property
  destroy: { method: "deleteCell", pickId },
});

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53RecoveryReadiness.html
exports.Route53RecoveryReadinessCell = ({ spec, config }) =>
  createAwsResource({
    model: model({ config }),
    spec,
    config,
    findName: pipe([get("live.CellName")]),
    findId: pipe([get("live.CellArn")]),
    getByName: ({ getList, endpoint, getById }) =>
      pipe([({ name }) => ({ CellName: name }), getById]),
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
          CellName: name,
          Tags: buildTagsObject({ name, config, namespace, userTags: Tags }),
        }),
        when(
          () => cells,
          assign({
            Cells: pipe([
              () => cells,
              map((cell) => getField(cell, "CellArn")),
            ]),
          })
        ),
      ])(),
  });
