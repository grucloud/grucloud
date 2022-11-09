const assert = require("assert");
const { pipe, tap, get, pick, eq, map, assign } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getField } = require("@grucloud/core/ProviderCommon");

const { buildTags } = require("../AwsCommon");

const { createAwsResource } = require("../AwsClient");
const { tagResource, untagResource, assignTags } = require("./MemoryDBCommon");

const pickId = pipe([({ Name }) => ({ SubnetGroupName: Name })]);

const model = ({ config }) => ({
  package: "memorydb",
  client: "MemoryDB",
  ignoreErrorCodes: ["SubnetGroupNotFoundFault"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MemoryDB.html#describeSubnetGroups-property
  getById: {
    method: "describeSubnetGroups",
    getField: "SubnetGroups",
    pickId,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MemoryDB.html#describeSubnetGroups-property
  getList: {
    method: "describeSubnetGroups",
    getParam: "SubnetGroups",
    decorate: assignTags,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MemoryDB.html#createSubnetGroup-property
  create: {
    method: "createSubnetGroup",
    filterPayload: pipe([
      ({ Name, ...other }) => ({
        SubnetGroupName: Name,
        ...other,
      }),
    ]),
    pickCreated: ({ payload }) => pipe([get("SubnetGroup")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MemoryDB.html#modifySubnetGroup-property
  update: {
    method: "modifySubnetGroup",
    //TODO
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MemoryDB.html#deleteSubnetGroup-property
  destroy: {
    method: "deleteSubnetGroup",
    pickId,
  },
});

const buildArn = () => pipe([get("ARN")]);

exports.MemoryDBSubnetGroup = ({ spec, config }) =>
  createAwsResource({
    model: model({ config }),
    spec,
    config,
    findName: pipe([get("live.Name")]),
    findId: pipe([get("live.Name")]),
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
      dependencies: { subnets },
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
        assign({
          SubnetIds: pipe([
            () => subnets,
            map((subnet) => getField(subnet, "SubnetId")),
          ]),
        }),
      ])(),
  });
