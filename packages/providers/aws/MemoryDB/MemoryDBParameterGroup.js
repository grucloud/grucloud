const assert = require("assert");
const { pipe, tap, get, pick, eq, map, assign } = require("rubico");
const { defaultsDeep, callProp } = require("rubico/x");
const { buildTags } = require("../AwsCommon");

const { createAwsResource } = require("../AwsClient");
const { tagResource, untagResource, assignTags } = require("./MemoryDBCommon");

const pickId = pipe([({ Name }) => ({ ParameterGroupName: Name })]);

const managedByOther = pipe([
  get("live.Name"),
  callProp("startsWith", "default"),
]);

const model = ({ config }) => ({
  package: "memorydb",
  client: "MemoryDB",
  ignoreErrorCodes: ["ParameterGroupNotFoundFault"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MemoryDB.html#describeParameterGroups-property
  getById: {
    method: "describeParameterGroups",
    getField: "ParameterGroups",
    pickId,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MemoryDB.html#describeParameterGroups-property
  getList: {
    method: "describeParameterGroups",
    getParam: "ParameterGroups",
    decorate: assignTags,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MemoryDB.html#createParameterGroup-property
  create: {
    method: "createParameterGroup",
    filterPayload: pipe([
      ({ Name, ...other }) => ({
        ParameterGroupName: Name,
        ...other,
      }),
    ]),
    pickCreated: ({ payload }) => pipe([get("ParameterGroup")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MemoryDB.html#modifyParameterGroup-property
  update: {
    method: "modifyParameterGroup",
    //TODO
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MemoryDB.html#deleteParameterGroup-property
  destroy: {
    method: "deleteParameterGroup",
    pickId,
  },
});

const buildArn = () => pipe([get("ARN")]);

exports.MemoryDBParameterGroup = ({ spec, config }) =>
  createAwsResource({
    model: model({ config }),
    spec,
    config,
    findName: pipe([get("live.Name")]),
    findId: pipe([get("live.Name")]),
    managedByOther,
    cannotBeDeleted: managedByOther,
    getByName: ({ getList, endpoint, getById }) =>
      pipe([
        ({ name }) => ({
          Name: name,
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
            UserTags: Tags,
          }),
        }),
      ])(),
  });
