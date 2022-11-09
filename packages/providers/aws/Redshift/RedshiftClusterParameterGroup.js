const assert = require("assert");
const { pipe, tap, get, pick, eq, map, assign } = require("rubico");
const { defaultsDeep, callProp } = require("rubico/x");
const { buildTags } = require("../AwsCommon");

const { createAwsResource } = require("../AwsClient");
const { tagResource, untagResource } = require("./RedshiftCommon");

const pickId = pipe([pick(["ParameterGroupName"])]);

const managedByOther = pipe([
  get("live.ParameterGroupName"),
  callProp("startsWith", "default"),
]);

const model = ({ config }) => ({
  package: "redshift",
  client: "Redshift",
  ignoreErrorCodes: ["ClusterParameterGroupNotFound"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Redshift.html#describeClusterParameterGroups-property
  getById: {
    method: "describeClusterParameterGroups",
    getField: "ParameterGroups",
    pickId,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Redshift.html#describeClusterParameterGroups-property
  getList: {
    method: "describeClusterParameterGroups",
    getParam: "ParameterGroups",
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
