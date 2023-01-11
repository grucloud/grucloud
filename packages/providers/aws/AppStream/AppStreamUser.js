const assert = require("assert");
const {
  pipe,
  tap,
  get,
  assign,
  map,
  pick,
  flatMap,
  tryCatch,
  filter,
  not,
  eq,
} = require("rubico");
const { defaultsDeep, when, isEmpty, find } = require("rubico/x");
const { getField } = require("@grucloud/core/ProviderCommon");

const { getByNameCore } = require("@grucloud/core/Common");

const pickId = pipe([
  tap(({ UserName }) => {
    assert(UserName);
  }),
  pick(["UserName", "AuthenticationType"]),
]);

const decorate =
  ({ endpoint, config }) =>
  (live) =>
    pipe([
      tap((params) => {
        assert(endpoint);
      }),
      () => live,
      JSON.stringify,
      JSON.parse,
      //omitIfEmpty(["instanceMetadataOptions", "logging.s3Logs", "logging"]),
    ])();

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppStream.html
exports.AppStreamUser = () => ({
  type: "User",
  package: "appstream",
  client: "AppStream",
  propertiesDefault: { AuthenticationType: "USERPOOL" },
  inferName: () =>
    pipe([
      get("UserName"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("UserName"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("UserName"),
      tap((id) => {
        assert(id);
      }),
    ]),
  omitProperties: ["Arn", "CreatedTime", "Status"],
  dependencies: {},
  ignoreErrorCodes: ["ResourceNotFoundException"],
  filterLive: ({ lives, providerConfig }) => pipe([assign({})]),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppStream.html#describeUsers-property
  getById: {
    method: "describeUsers",
    decorate: ({ live }) =>
      pipe([
        tap((params) => {
          assert(live.UserName);
        }),
        get("Users"),
        find(eq(get("UserName"), live.UserName)),
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppStream.html#describeUsers-property
  // getList: {
  //   method: "describeUsers",
  //   getParam: "Users",
  //   decorate,
  // },
  getList: ({ endpoint }) =>
    pipe([
      //() => ["API", "SAML", "USERPOOL", "AWS_AD"],
      () => ["USERPOOL"],
      flatMap(
        tryCatch(
          pipe([
            (AuthenticationType) => ({
              AuthenticationType,
            }),
            endpoint().describeUsers,
            get("Users"),
            tap((params) => {
              assert(true);
            }),
          ]),
          // TODO throw if not  "ResourceNotFoundException" or "AccessDeniedException",
          (error) =>
            pipe([
              tap((params) => {
                assert(error);
              }),
              () => undefined,
            ])()
        )
      ),
      filter(not(isEmpty)),
    ]),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppStream.html#createUser-property
  create: {
    method: "createUser",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppStream.html#updateUser-property
  update: {
    method: "updateUser",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppStream.html#deleteUser-property
  destroy: {
    method: "deleteUser",
    pickId,
  },
  getByName: getByNameCore,

  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { iamRole, securityGroups, subnets },
    config,
  }) =>
    pipe([
      () => otherProps,
      when(
        () => iamRole,
        defaultsDeep({
          IamRoleArn: getField(iamRole, "Arn"),
        })
      ),
      when(
        () => securityGroups,
        defaultsDeep({
          VpcConfig: {
            SecurityGroupIds: pipe([
              () => securityGroups,
              map((sg) => getField(sg, "GroupId")),
            ])(),
          },
        })
      ),
      when(
        () => subnets,
        defaultsDeep({
          VpcConfig: {
            SubnetIds: pipe([
              () => subnets,
              map((subnet) => getField(subnet, "SubnetId")),
            ])(),
          },
        })
      ),
    ])(),
});
