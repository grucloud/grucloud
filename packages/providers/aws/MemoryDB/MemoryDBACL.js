const assert = require("assert");
const { pipe, tap, get, eq, map, assign } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getField } = require("@grucloud/core/ProviderCommon");

const { buildTags } = require("../AwsCommon");

const { Tagger, assignTags } = require("./MemoryDBCommon");

const pickId = pipe([({ Name }) => ({ ACLName: Name })]);

const managedByOther = () => pipe([eq(get("Name"), "open-access")]);

const buildArn = () => pipe([get("ARN")]);

exports.MemoryDBACL = ({}) => ({
  package: "memorydb",
  client: "MemoryDB",
  type: "ACL",
  inferName: () => get("Name"),
  findName: () => pipe([get("Name")]),
  findId: () => pipe([get("Name")]),
  managedByOther,
  cannotBeDeleted: managedByOther,
  omitProperties: [
    "Status",
    "Clusters",
    "ARN",
    "MinimumEngineVersion",
    "UserNames",
  ],
  dependencies: {
    users: {
      type: "User",
      group: "MemoryDB",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([
          get("UserNames"),
          tap((params) => {
            assert(true);
          }),
        ]),
    },
  },
  ignoreErrorCodes: ["ACLNotFoundFault"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MemoryDB.html#describeACLs-property
  getById: {
    method: "describeACLs",
    getField: "ACLs",
    pickId,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MemoryDB.html#describeACLs-property
  getList: {
    method: "describeACLs",
    getParam: "ACLs",
    decorate: assignTags,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MemoryDB.html#createACL-property
  create: {
    method: "createACL",
    filterPayload: pipe([
      ({ Name, ...other }) => ({
        ACLName: Name,
        ...other,
      }),
    ]),
    pickCreated: ({ payload }) => pipe([get("ACL")]),
    isInstanceUp: pipe([eq(get("Status"), "active")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MemoryDB.html#updateACL-property
  update: {
    method: "updateACL",
    //TODO
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MemoryDB.html#deleteACL-property
  destroy: {
    method: "deleteACL",
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
    dependencies: { users },
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
      assign({
        UserNames: pipe([() => users, map((user) => getField(user, "Name"))]),
      }),
    ])(),
});
