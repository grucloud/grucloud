const assert = require("assert");
const { pipe, tap, get } = require("rubico");
const { defaultsDeep, isDeepEqual } = require("rubico/x");

const cannotBeDeleted = () =>
  pipe([
    get("autoEnable"),
    (autoEnable) =>
      isDeepEqual(autoEnable, {
        ec2: false,
        ecr: false,
      }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Inspector2.html
exports.Inspector2OrganizationConfiguration = ({}) => ({
  type: "OrganizationConfiguration",
  package: "inspector2",
  client: "Inspector2",
  ignoreErrorCodes: ["ResourceNotFoundException", "AccessDeniedException"],
  inferName: () => () => "default",
  findName: () => pipe([() => "default"]),
  findId: () => pipe([() => "default"]),
  cannotBeDeleted,
  omitProperties: ["maxAccountLimitReached"],
  ignoreResource: () =>
    pipe([
      get("live"),
      get("autoEnable"),
      (autoEnable) =>
        isDeepEqual(autoEnable, {
          ec2: false,
          ecr: false,
          //TODO lambda
        }),
    ]),
  getById: {
    method: "describeOrganizationConfiguration",
    pickId: () => ({}),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Inspector2.html#updateOrganizationConfiguration-property
  create: {
    method: "updateOrganizationConfiguration",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  update: {
    method: "updateOrganizationConfiguration",
    filterParams: ({ payload, live }) => pipe([() => payload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Inspector2.html#updateOrganizationConfiguration-property
  destroy: {
    method: "updateOrganizationConfiguration",
    pickId: ({}) => ({
      autoEnable: {
        ec2: false,
        ecr: false,
      },
    }),
  },
  getList: ({ endpoint, getById }) => pipe([getById({}), (result) => [result]]),
  getByName: ({ getList, endpoint, getById }) => pipe([getById({})]),
  configDefault: ({ name, namespace, properties: { ...otherProps } }) =>
    pipe([() => otherProps, defaultsDeep({})])(),
});
