const assert = require("assert");
const { pipe, tap, get } = require("rubico");
const { defaultsDeep, callProp } = require("rubico/x");
const { buildTags } = require("../AwsCommon");

const { Tagger, assignTags } = require("./MemoryDBCommon");

const pickId = pipe([({ Name }) => ({ ParameterGroupName: Name })]);

const managedByOther = () =>
  pipe([get("Name"), callProp("startsWith", "default")]);

const buildArn = () => pipe([get("ARN")]);

exports.MemoryDBParameterGroup = ({}) => ({
  type: "ParameterGroup",
  package: "memorydb",
  client: "MemoryDB",
  inferName: () => get("Name"),
  findName: () => pipe([get("Name")]),
  findId: () => pipe([get("Name")]),
  managedByOther,
  cannotBeDeleted: managedByOther,
  omitProperties: ["ARN"],
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
  getByName: ({ getList, endpoint, getById }) =>
    pipe([
      ({ name }) => ({
        Name: name,
      }),
      getById({}),
    ]),
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: {},
    config,
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
