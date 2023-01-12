const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const defaultName = "default";

const pickId = pipe([
  tap(({ InstanceArn }) => {
    assert(InstanceArn);
  }),
  pick(["InstanceArn"]),
]);

const decorate = ({ endpoint, live }) =>
  pipe([
    tap((params) => {
      assert(live.InstanceArn);
    }),
    defaultsDeep({ InstanceArn: live.InstanceArn }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SSOAdmin.html
exports.SSOAdminInstanceAccessControlAttribute = ({}) => ({
  type: "InstanceAccessControlAttribute",
  package: "sso-admin",
  client: "SSOAdmin",
  inferName: () => pipe([() => defaultName]),
  findName: () => pipe([() => defaultName]),
  findId: () => pipe([get("InstanceArn")]),
  propertiesDefault: {},
  omitProperties: ["InstanceArn"],
  dependencies: {
    identityStore: {
      type: "Instance",
      group: "SSOAdmin",
      parent: true,
      dependencyId: ({ lives, config }) =>
        pipe([
          get("InstanceArn"),
          tap((InstanceArn) => {
            assert(InstanceArn);
          }),
        ]),
    },
  },
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SSOAdmin.html#describeInstanceAccessControlAttributeConfiguration-property
  getById: {
    method: "describeInstanceAccessControlAttributeConfiguration",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SSOAdmin.html#createInstanceAccessControlAttributeConfiguration-property
  create: {
    method: "createInstanceAccessControlAttributeConfiguration",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SSOAdmin.html#deleteInstanceAccessControlAttributeConfiguration-property
  destroy: {
    method: "deleteInstanceAccessControlAttributeConfiguration",
    pickId,
  },
  getByName: getByNameCore,
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "Instance", group: "SSOAdmin" },
          pickKey: pipe([
            pick(["InstanceArn"]),
            tap(({ InstanceArn }) => {
              assert(InstanceArn);
            }),
          ]),
          method: "describeInstanceAccessControlAttributeConfiguration",
          config,
          decorate: ({ parent }) =>
            pipe([decorate({ endpoint, live: parent })]),
        }),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SSOAdmin.html#updateInstanceAccessControlAttributeConfiguration-property
  update: {
    method: "updateInstanceAccessControlAttributeConfiguration",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: { identityStore },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(identityStore);
      }),
      () => otherProps,
      defaultsDeep({
        InstanceArn: getField(identityStore, "InstanceArn"),
      }),
    ])(),
});
