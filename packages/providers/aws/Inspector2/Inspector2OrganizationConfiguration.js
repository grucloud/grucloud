const assert = require("assert");
const { pipe, tap, get } = require("rubico");
const { defaultsDeep, isDeepEqual } = require("rubico/x");

const { createAwsResource } = require("../AwsClient");

const cannotBeDeleted = pipe([
  get("live"),
  get("autoEnable"),
  (autoEnable) =>
    isDeepEqual(autoEnable, {
      ec2: false,
      ecr: false,
    }),
]);
const model = ({ config }) => ({
  package: "inspector2",
  client: "Inspector2",
  ignoreErrorCodes: ["ResourceNotFoundException", "AccessDeniedException"],
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
});

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Inspector2.html
exports.Inspector2OrganizationConfiguration = ({ spec, config }) =>
  createAwsResource({
    model: model({ config }),
    spec,
    config,
    findName: pipe([() => "default"]),
    findId: pipe([() => "default"]),
    cannotBeDeleted,
    getList: ({ endpoint, getById }) =>
      pipe([getById({}), (result) => [result]]),
    getByName: ({ getList, endpoint, getById }) => pipe([getById({})]),
    configDefault: ({ name, namespace, properties: { ...otherProps } }) =>
      pipe([() => otherProps, defaultsDeep({})])(),
  });
