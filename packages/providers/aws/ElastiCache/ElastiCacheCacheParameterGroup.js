const assert = require("assert");
const {
  pipe,
  tap,
  get,
  pick,
  assign,
  filter,
  map,
  and,
  eq,
} = require("rubico");
const { defaultsDeep, callProp } = require("rubico/x");
const { getByNameCore, omitIfEmpty } = require("@grucloud/core/Common");

const { buildTags } = require("../AwsCommon");

const { createAwsResource } = require("../AwsClient");
const {
  tagResource,
  untagResource,
  assignTags,
} = require("./ElastiCacheCommon");

const pickId = pipe([pick(["CacheParameterGroupName"])]);
const buildArn = () => pipe([get("ARN")]);

const decorate = ({ endpoint }) =>
  pipe([
    assign({
      Parameters: pipe([
        pick(["CacheParameterGroupName"]),
        endpoint().describeCacheParameters,
        get("Parameters"),
        filter(and([get("IsModifiable"), eq(get("Source"), "user")])),
        map(pick(["ParameterName", "ParameterValue"])),
      ]),
    }),
    omitIfEmpty(["Parameters"]),
    assignTags({ endpoint, buildArn: buildArn() }),
  ]);

const managedByOther = pipe([
  get("live.CacheParameterGroupName"),
  callProp("startsWith", "default."),
]);

const model = ({ config }) => ({
  package: "elasticache",
  client: "ElastiCache",
  ignoreErrorCodes: ["CacheParameterGroupNotFound"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ElastiCache.html#describeCacheParameterGroups-property
  getById: {
    method: "describeCacheParameterGroups",
    getField: "CacheParameterGroups",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ElastiCache.html#describeCacheParameterGroups-property
  getList: {
    method: "describeCacheParameterGroups",
    getParam: "CacheParameterGroups",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ElastiCache.html#createCacheParameterGroup-property
  create: {
    method: "createCacheParameterGroup",
    pickCreated: ({ payload }) => pipe([get("CacheParameterGroup")]),
    postCreate: ({ endpoint, payload }) =>
      pipe([
        tap((params) => {
          assert(true);
        }),
        // chunks  Parameters
        //TODO call modifyCacheParameterGroup
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ElastiCache.html#modifyCacheParameterGroup-property
  update: {
    method: "modifyCacheParameterGroup",
    filterParams: ({ payload, diff }) =>
      pipe([
        tap((params) => {
          assert(diff);
        }),
        () => diff,
        get("liveDiff.updated.Parameters", {}),
        Object.entries,
        map(([key, param]) =>
          pipe([
            () => payload,
            get(`Parameters[${key}]`),
            get("ParameterName"),
            (ParameterName) => ({
              ParameterName,
              ParameterValue: param.ParameterValue,
            }),
          ])()
        ),
        (ParameterNameValues) => ({
          CacheParameterGroupName: payload.CacheParameterGroupName,
          ParameterNameValues,
        }),
      ])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ElastiCache.html#deleteCacheParameterGroup-property
  destroy: {
    method: "deleteCacheParameterGroup",
    pickId,
  },
});

exports.ElastiCacheCacheParameterGroup = ({ spec, config }) =>
  createAwsResource({
    model: model({ config }),
    spec,
    config,
    findName: pipe([get("live.CacheParameterGroupName")]),
    findId: pipe([get("live.CacheParameterGroupName")]),
    managedByOther,
    cannotBeDeleted: managedByOther,
    getByName: getByNameCore,
    tagResource: tagResource({
      buildArn: buildArn(config),
    }),
    untagResource: untagResource({
      buildArn: buildArn(config),
    }),
    configDefault: ({
      name,
      namespace,
      properties: { Tags, ...otherProps },
      dependencies: {},
    }) =>
      pipe([
        () => otherProps,
        defaultsDeep({
          Tags: buildTags({
            name,
            config,
            namespace,
            UserTags: Tags,
          }),
        }),
      ])(),
  });
