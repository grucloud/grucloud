const assert = require("assert");
const { pipe, tap, get } = require("rubico");
const { defaultsDeep, identity } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const pickId = pipe([
  tap((params) => {
    assert(true);
  }),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/FMS.html
exports.FMSAdminAccount = () => ({
  type: "AdminAccount",
  package: "fms",
  client: "FMS",
  propertiesDefault: {},
  omitProperties: [],
  findName: () => pipe([() => "default"]),
  findId: () => pipe([() => "default"]),
  inferName: () => () => "default",
  ignoreErrorCodes: ["ResourceNotFoundException", "AccessDeniedException"],
  dependencies: {
    account: {
      type: "Account",
      group: "Organisations",
      dependencyId: () =>
        pipe([
          get("AdminAccount"),
          tap((AdminAccount) => {
            assert(AdminAccount);
          }),
        ]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/FMS.html#getAdminAccount-property
  getById: {
    method: "getAdminAccount",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/FMS.html#getAdminAccount-property
  getList: {
    method: "getAdminAccount",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/FMS.html#associateAdminAccount-property
  create: {
    method: "associateAdminAccount",
    pickCreated: ({ payload }) => pipe([identity]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/FMS.html#deleteAdminAccount-property
  destroy: {
    method: "disassociateAdminAccount",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: { account },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(account);
      }),
      () => otherProps,
      defaultsDeep({
        AdminAccount: getField(account, "Id"),
      }),
    ])(),
});
