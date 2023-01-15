const assert = require("assert");
const { pipe, tap, get, eq } = require("rubico");
const { defaultsDeep, when } = require("rubico/x");

const { buildTags } = require("../AwsCommon");

const { createAwsResource } = require("../AwsClient");
const { tagResource, untagResource, assignTags } = require("./MemoryDBCommon");

const pickId = pipe([({ Name }) => ({ UserName: Name })]);

const managedByOther = () => pipe([eq(get("Name"), "default")]);

const model = ({ config }) => ({
  package: "memorydb",
  client: "MemoryDB",
  ignoreErrorCodes: ["UserNotFoundFault"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MemoryDB.html#describeUsers-property
  getById: {
    method: "describeUsers",
    getField: "Users",
    pickId,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MemoryDB.html#describeUsers-property
  getList: {
    method: "describeUsers",
    getParam: "Users",
    decorate: assignTags,
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
});

const buildArn = () => pipe([get("ARN")]);

exports.MemoryDBUser = ({ spec, config }) =>
  createAwsResource({
    model: model({ config }),
    spec,
    config,
    findName: () => pipe([get("Name")]),
    findId: () => pipe([get("Name")]),
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
