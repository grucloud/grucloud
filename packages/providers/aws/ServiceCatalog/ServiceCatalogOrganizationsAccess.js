const assert = require("assert");
const { pipe, tap, eq, get, switchCase } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");

const pickId = pipe([
  tap((params) => {
    assert(true);
  }),
  () => ({}),
]);
const isDisabled = eq(get("AccessStatus"), "DISABLED");
const cannotBeDeleted = () => pipe([isDisabled]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

const findName = () => pipe([() => "default"]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ServiceCatalog.html
exports.ServiceCatalogOrganizationsAccess = () => ({
  type: "OrganizationsAccess",
  package: "service-catalog",
  client: "ServiceCatalog",
  propertiesDefault: {},
  omitProperties: [],
  inferName: findName,
  findName,
  findId: findName,
  ignoreErrorCodes: ["InvalidStateException"],
  cannotBeDeleted,
  managedByOther: cannotBeDeleted,
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ServiceCatalog.html#getAWSOrganizationsAccessStatus-property
  getById: {
    method: "getAWSOrganizationsAccessStatus",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ServiceCatalog.html#getAWSOrganizationsAccessStatus-property
  getList: {
    method: "getAWSOrganizationsAccessStatus",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ServiceCatalog.html#enableAWSOrganizationsAccess-property
  // create: {
  //   method: "enableAWSOrganizationsAccess",
  //   pickCreated: ({ payload }) => pipe([() => payload]),
  // },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ServiceCatalog.html#updateOrganizationsAccess-property
  update:
    ({ endpoint, getById }) =>
    async ({ payload, live, diff }) =>
      pipe([
        () => payload,
        switchCase([
          isDisabled,
          endpoint().disableAWSOrganizationsAccess,
          endpoint().enableAWSOrganizationsAccess,
        ]),
      ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ServiceCatalog.html#disableAWSOrganizationsAccess-property
  destroy: {
    method: "disableAWSOrganizationsAccess",
    pickId,
    isInstanceDown: () => true,
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
