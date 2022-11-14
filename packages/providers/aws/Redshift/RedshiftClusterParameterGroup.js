const assert = require("assert");
const { pipe, tap, get, pick, not, map, assign } = require("rubico");
const { defaultsDeep, callProp } = require("rubico/x");
const { omitIfEmpty } = require("@grucloud/core/Common");

const { buildTags } = require("../AwsCommon");

const { createAwsResource } = require("../AwsClient");
const { tagResource, untagResource } = require("./RedshiftCommon");

const pickId = pipe([
  tap(({ ParameterGroupName }) => {
    assert(ParameterGroupName);
  }),
  pick(["ParameterGroupName"]),
]);

const isDefaultParameterGroup = pipe([
  get("ParameterGroupName"),
  callProp("startsWith", "default"),
]);

const managedByOther = pipe([get("live"), isDefaultParameterGroup]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Redshift.html#describeClusterParameters-property
const decorate = ({ endpoint }) =>
  pipe([
    assign({
      Parameters: pipe([
        pickId,
        defaultsDeep({ Source: "user" }),
        endpoint().describeClusterParameters,
        get("Parameters"),
        map(pick(["ParameterName", "ParameterValue"])),
      ]),
    }),
    omitIfEmpty(["Parameters"]),
  ]);

const model = ({ config }) => ({
  package: "redshift",
  client: "Redshift",
  ignoreErrorCodes: [
    "ClusterParameterGroupNotFound",
    "ClusterParameterGroupNotFoundFault",
  ],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Redshift.html#describeClusterParameterGroups-property
  getById: {
    method: "describeClusterParameterGroups",
    getField: "ParameterGroups",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Redshift.html#describeClusterParameterGroups-property
  getList: {
    method: "describeClusterParameterGroups",
    filterResource: pipe([not(isDefaultParameterGroup)]),
    getParam: "ParameterGroups",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Redshift.html#createClusterParameterGroup-property
  create: {
    method: "createClusterParameterGroup",
    pickCreated: ({ payload }) => pipe([get("ClusterParameterGroup")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Redshift.html#modifyClusterParameterGroup-property
  update: {
    method: "modifyClusterParameterGroup",
    //TODO
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Redshift.html#deleteClusterParameterGroup-property
  destroy: {
    method: "deleteClusterParameterGroup",
    pickId,
  },
});

// arn:aws:redshift:region:account-id:parametergroup:parameter-group-name
const buildArn = ({ accountId, region }) =>
  pipe([
    ({ ParameterGroupName }) =>
      `arn:aws:redshift:${region}:${accountId()}:parametergroup:${ParameterGroupName}`,
  ]);

exports.RedshiftClusterParameterGroup = ({ spec, config }) =>
  createAwsResource({
    model: model({ config }),
    spec,
    config,
    findName: pipe([get("live.ParameterGroupName")]),
    findId: pipe([get("live.ParameterGroupName")]),
    managedByOther,
    cannotBeDeleted: managedByOther,
    getByName: ({ getList, endpoint, getById }) =>
      pipe([
        ({ name }) => ({
          ParameterGroupName: name,
        }),
        getById({}),
      ]),
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
            userTags: Tags,
          }),
        }),
      ])(),
  });
