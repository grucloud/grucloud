const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(true);
    }),
  ]);

const findName =
  () =>
  ({ StackName, UserName }) =>
    pipe([
      tap(() => {
        assert(StackName);
        assert(UserName);
      }),
      () => `${StackName}::${UserName}`,
    ])();

const filterPayload = (UserStackAssociation) => ({
  UserStackAssociations: [UserStackAssociation],
});
// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppStream.html
exports.AppStreamUserStackAssociation = () => ({
  type: "UserStackAssociation",
  package: "appstream",
  client: "AppStream",
  propertiesDefault: { AuthenticationType: "USERPOOL" },
  inferName: ({ dependenciesSpec: { stack, user } }) =>
    pipe([
      tap(() => {
        assert(stack);
        assert(user);
      }),
      () => `${stack}::${user}`,
    ]),
  findName:
    () =>
    ({ StackName, UserName }) =>
      pipe([
        tap(() => {
          assert(StackName);
          assert(UserName);
        }),
        () => `${StackName}::${UserName}`,
      ])(),
  findId: findName,
  omitProperties: ["StackName", "UserName"],
  dependencies: {
    stack: {
      type: "Stack",
      group: "AppStream",
      parent: true,
      dependencyId: () =>
        pipe([
          get("StackName"),
          tap((StackName) => {
            assert(StackName);
          }),
        ]),
    },
    user: {
      type: "User",
      group: "AppStream",
      parent: true,
      dependencyId: () =>
        pipe([
          get("UserName"),
          tap((UserName) => {
            assert(UserName);
          }),
        ]),
    },
  },
  ignoreErrorCodes: [
    "UserStackAssociationNotFoundException",
    "ResourceNotFoundException",
  ],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppStream.html#describeUserStackAssociations-property
  getById: {
    method: "describeUserStackAssociations",
    getField: "UserStackAssociations",
    pickId: pipe([
      tap(({ UserName, StackName }) => {
        assert(UserName);
        assert(StackName);
      }),
      pick(["UserName", "StackName"]),
      defaultsDeep({ AuthenticationType: "USERPOOL" }),
    ]),
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppStream.html#describeUserStackAssociations-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "Stack", group: "AppStream" },
          pickKey: pipe([
            ({ Name }) => ({ StackName: Name, AuthenticationType: "USERPOOL" }),
          ]),
          method: "describeUserStackAssociations",
          getParam: "UserStackAssociations",
          config,
          decorate,
        }),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppStream.html#batchAssociateUserStack-property
  create: {
    method: "batchAssociateUserStack",
    filterPayload,
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppStream.html#batchDisassociateUserStack-property
  destroy: {
    method: "batchDisassociateUserStack",
    pickId: filterPayload,
  },
  getByName: getByNameCore,
  configDefault: ({
    properties: { ...otherProps },
    dependencies: { stack, user },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(stack);
        assert(stack.config.Name);
        assert(user);
        assert(user.config.UserName);
      }),
      () => otherProps,
      defaultsDeep({
        StackName: stack.config.Name,
        UserName: user.config.UserName,
      }),
    ])(),
});
