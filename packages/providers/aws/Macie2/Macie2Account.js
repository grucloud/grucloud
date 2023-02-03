const assert = require("assert");
const { pipe, tap } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { ignoreErrorCodes } = require("./Macie2Common");

const pickId = pipe([() => ({})]);

const decorate = ({ endpoint }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

const findName = () => () => "default";

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Macie2.html
exports.Macie2Account = () => ({
  type: "Account",
  package: "macie2",
  client: "Macie2",
  propertiesDefault: {},
  omitProperties: ["createdAt", "serviceRole", "updatedAt"],
  inferName: findName,
  findName,
  findId: findName,
  dependencies: {},
  ignoreErrorCodes,
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Macie2.html#listOrganizationAdminAccounts-property
  getById: {
    method: "getMacieSession",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Macie2.html#listOrganizationAdminAccounts-property
  getList: {
    method: "getMacieSession",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Macie2.html#enableMacie-property
  create: {
    method: "enableMacie",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  update: {
    method: "enableMacie",
    filterParams: ({ payload, diff, live }) => pipe([() => payload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Macie2.html#disableMacie-property
  destroy: {
    method: "disableMacie",
    pickId: () => ({}),
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: {},
    config,
  }) => pipe([() => otherProps, defaultsDeep({})])(),
});
