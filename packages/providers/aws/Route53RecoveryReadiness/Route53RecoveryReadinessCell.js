const assert = require("assert");
const { pipe, tap, get, omit, pick, assign, map } = require("rubico");
const { defaultsDeep, when } = require("rubico/x");
const { buildTagsObject } = require("@grucloud/core/Common");

const { Tagger } = require("./Route53RecoveryReadinessCommon");
const { getField } = require("@grucloud/core/ProviderCommon");
const pickId = pipe([pick(["CellName"])]);
const { replaceRegion } = require("../AwsCommon");

const buildArn = () =>
  pipe([
    get("CellArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53RecoveryReadiness.html
exports.Route53RecoveryReadinessCell = ({}) => ({
  type: "Cell",
  package: "route53-recovery-readiness",
  client: "Route53RecoveryReadiness",
  region: "us-west-2",
  inferName: () => get("CellName"),
  findName: () => pipe([get("CellName")]),
  findId: () => pipe([get("CellArn")]),
  dependencies: {
    cells: {
      type: "Cell",
      group: "Route53RecoveryReadiness",
      list: true,
      dependencyIds: ({ lives, config }) => get("Cells"),
    },
  },
  omitProperties: ["CellArn", "ParentReadinessScopes", "Cells"],
  filterLive: ({ lives, providerConfig }) =>
    pipe([
      assign({
        CellName: pipe([get("CellName"), replaceRegion({ providerConfig })]),
      }),
    ]),
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
  getByName: ({ getList, endpoint, getById }) =>
    pipe([({ name }) => ({ CellName: name }), getById({})]),
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { cells },
    config,
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
          Cells: pipe([() => cells, map((cell) => getField(cell, "CellArn"))]),
        })
      ),
    ])(),
});
