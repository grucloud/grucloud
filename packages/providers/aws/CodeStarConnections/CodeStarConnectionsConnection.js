const assert = require("assert");
const { pipe, map, tap, get, pick, assign } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { buildTags } = require("../AwsCommon");

const { Tagger } = require("./CodeStarConnectionsCommon");

const pickId = pick(["ConnectionArn"]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodeStarconnections.html#listTagsForResource-property
const assignTags = ({ endpoint }) =>
  pipe([
    assign({
      Tags: pipe([
        ({ ConnectionArn }) => ({ ResourceArn: ConnectionArn }),
        endpoint().listTagsForResource,
        get("Tags"),
      ]),
    }),
  ]);

const buildArn = () =>
  pipe([
    get("ConnectionArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodeStarconnections.html
exports.CodeStarConnectionsConnection = ({}) => ({
  type: "Connection",
  package: "codestar-connections",
  client: "CodeStarConnections",
  inferName: () => pipe([get("ConnectionName")]),
  findName: () => pipe([get("ConnectionName")]),
  findId: () => pipe([get("ConnectionArn")]),
  getByName: getByNameCore,
  ignoreErrorCodes: ["ResourceNotFoundException"],
  omitProperties: [
    "ConnectionArn",
    "ConnectionStatus",
    "OwnerAccountId",
    "HostArn",
  ],
  //TODO Host
  //dependencies: { type: "Host", group: GROUP },
  propertiesDefault: {},
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodeStarconnections.html#getConnection-property
  getById: {
    method: "getConnection",
    pickId: pickId,
    getField: "Connection",
    decorate: ({ endpoint }) => pipe([assignTags({ endpoint })]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodeStarconnections.html#listConnections-property
  getList: {
    method: "listConnections",
    getParam: "Connections",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodeStarconnections.html#createConnection-property
  create: {
    method: "createConnection",
    pickCreated: ({ payload }) => pickId,
    postCreate:
      ({ endpoint, payload: { Tags } }) =>
      ({ ConnectionArn }) =>
        pipe([
          tap((params) => {
            assert(ConnectionArn);
          }),
          () => ({ ResourceArn: ConnectionArn, Tags }),
          endpoint().tagResource,
        ])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodeStarconnections.html#deleteConnection-property
  destroy: { method: "deleteConnection", pickId },
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  configDefault: ({
    name,
    namespace,
    properties: { tags, ...otherProps },
    dependencies: { host },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        Tags: buildTags({
          name,
          config,
          namespace,
          UserTags: tags,
        }),
      }),
      //TODO
      //when(() => host, defaultsDeep({})),
    ])(),
});
