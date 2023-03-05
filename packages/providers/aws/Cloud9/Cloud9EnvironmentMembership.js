const assert = require("assert");
const { pipe, tap, get, pick, eq, fork } = require("rubico");
const { defaultsDeep, find } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const pickId = pipe([
  tap(({ environmentId, userArn }) => {
    assert(environmentId);
    assert(userArn);
  }),
  pick(["environmentId", "userArn"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Cloud9.html
exports.Cloud9EnvironmentMembership = () => ({
  type: "EnvironmentMembership",
  package: "cloud9",
  client: "Cloud9",
  propertiesDefault: {},
  omitProperties: ["environmentId", "userArn"],
  inferName:
    ({ dependenciesSpec: { environment, iamUser } }) =>
    ({}) =>
      pipe([
        tap((params) => {
          assert(environment);
          assert(iamUser);
        }),
        () => `${environment}::${iamUser}`,
      ])(),
  findName:
    ({ lives, config }) =>
    (live) =>
      pipe([
        () => live,
        fork({
          environment: pipe([
            get("environmentId"),
            tap((id) => {
              assert(id);
            }),
            lives.getById({
              type: "Environment",
              group: "Cloud9",
              providerName: config.providerName,
            }),
            get("name", live.environmentId),
          ]),
          iamUser: pipe([
            get("userArn"),
            tap((id) => {
              assert(id);
            }),
            lives.getById({
              type: "User",
              group: "IAM",
              providerName: config.providerName,
            }),
            get("name", live.userArn),
          ]),
        }),
        tap(({ environment, iamUser }) => {
          assert(environment);
          assert(iamUser);
        }),
        ({ environment, iamUser }) => `${environment}::${iamUser}`,
      ])(),
  findId:
    () =>
    ({ environmentId, userArn }) =>
      pipe([
        tap(() => {
          assert(environmentId);
          assert(userArn);
        }),
        () => `${environmentId}::${userArn}`,
      ])(),
  ignoreErrorCodes: [404],
  dependencies: {
    environment: {
      type: "Environment",
      group: "Cloud9",
      dependencyId: ({ lives, config }) =>
        pipe([
          get("environmentId"),
          tap((id) => {
            assert(id);
          }),
        ]),
    },
    iamUser: {
      type: "User",
      group: "IAM",
      dependencyId: ({ lives, config }) =>
        pipe([
          get("userArn"),
          tap((id) => {
            assert(id);
          }),
        ]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Cloud9.html#describeEnvironmentMemberships-property
  getById: {
    method: "describeEnvironmentMemberships",
    pickId: pipe([
      tap(({ environmentId }) => {
        assert(environmentId);
      }),
    ]),
    decorate: ({ live }) =>
      pipe([
        tap(() => {
          assert(live.userArn);
        }),
        get("memberships"),
        find(eq(get("userArn"), live.userArn)),
        tap((params) => {
          assert(true);
        }),
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Cloud9.html#listEnvironmentMemberships-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "Environment", group: "Cloud9" },
          pickKey: pipe([
            pick(["environmentId"]),
            tap(({ environmentId }) => {
              assert(environmentId);
            }),
          ]),
          method: "describeEnvironmentMemberships",
          getParam: "memberships",
          config,
          decorate,
        }),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Cloud9.html#createEnvironmentMembership-property
  create: {
    method: "createEnvironmentMembership",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Cloud9.html#updateEnvironmentMembership-property
  update: {
    method: "updateEnvironmentMembership",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Cloud9.html#deleteEnvironmentMembership-property
  destroy: {
    method: "deleteEnvironmentMembership",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: { environment, iamUser },
    config,
  }) =>
    pipe([
      () => otherProps,
      tap(() => {
        assert(environment);
        assert(iamUser);
      }),
      defaultsDeep({
        environmentId: getField(environment, "environmentId"),
        userArn: getField(iamUser, "Arn"),
      }),
      tap(({ userArn, environmentId }) => {
        assert(userArn);
        assert(environmentId);
      }),
    ])(),
});
