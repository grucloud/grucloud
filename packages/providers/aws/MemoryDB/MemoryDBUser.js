const assert = require("assert");
const { pipe, tap, get, eq, omit, not } = require("rubico");
const { defaultsDeep, when } = require("rubico/x");

const { buildTags } = require("../AwsCommon");

const { Tagger, assignTags } = require("./MemoryDBCommon");

const pickId = pipe([({ Name }) => ({ UserName: Name })]);

const managedByOther = () => pipe([eq(get("Name"), "default")]);

const buildArn = () => pipe([get("ARN")]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(true);
    }),
    ({ Authentication, ...other }) => ({
      AuthenticationMode: Authentication,
      ...other,
    }),
    assignTags({ buildArn: buildArn(config), endpoint }),
  ]);

exports.MemoryDBUser = ({ compare }) => ({
  type: "User",
  package: "memorydb",
  client: "MemoryDB",
  inferName: () => get("Name"),
  findName: () => pipe([get("Name")]),
  findId: () => pipe([get("Name")]),
  managedByOther,
  cannotBeDeleted: managedByOther,
  ignoreErrorCodes: ["UserNotFoundFault"],
  omitProperties: [
    "ACLNames",
    "ARN",
    "MinimumEngineVersion",
    "Status",
    "AuthenticationMode.PasswordCount",
  ],
  environmentVariables: [
    {
      path: "AuthenticationMode.Passwords",
      suffix: "MEMORYDB_USER_PASSWORDS",
      array: true,
      rejectEnvironmentVariable: () =>
        pipe([not(eq(get("AuthenticationMode.Type"), "password"))]),
    },
  ],
  compare: compare({
    filterTarget: () => pipe([omit(["AuthenticationMode"])]),
  }),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MemoryDB.html#describeUsers-property
  getById: {
    method: "describeUsers",
    getField: "Users",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MemoryDB.html#describeUsers-property
  getList: {
    method: "describeUsers",
    getParam: "Users",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MemoryDB.html#createUser-property
  create: {
    method: "createUser",
    filterPayload: pipe([
      ({ Name, ...other }) => ({
        UserName: Name,
        ...other,
      }),
    ]),
    pickCreated: ({ payload }) => pipe([get("User")]),
    isInstanceUp: pipe([eq(get("Status"), "active")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MemoryDB.html#updateUser-property
  update: {
    method: "updateUser",
    //TODO
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MemoryDB.html#deleteUser-property
  destroy: {
    method: "deleteUser",
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
      when(
        get("AuthenticationMode.Passwords"),
        defaultsDeep({
          AuthenticationMode: {
            Type: "password",
          },
        })
      ),
    ])(),
});
