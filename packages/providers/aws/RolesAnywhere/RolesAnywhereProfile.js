const assert = require("assert");
const { pipe, tap, get, pick, eq, assign, map, not } = require("rubico");
const { defaultsDeep, when } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTags, replaceAccountAndRegion } = require("../AwsCommon");

const { Tagger, assignTags } = require("./RolesAnywhereCommon");

const managedByOther = ({ config }) =>
  pipe([
    tap((params) => {
      assert(config);
      assert(config.accountId());
    }),
    not(eq(get("createdBy"), config.accountId())),
  ]);

const buildArn = () =>
  pipe([
    get("profileArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ profileId }) => {
    assert(profileId);
  }),
  pick(["profileId"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap(({}) => {
      assert(endpoint);
    }),
    assignTags({ buildArn: buildArn(config), endpoint }),
    when(
      get("sessionPolicy"),
      assign({ sessionPolicy: pipe([get("sessionPolicy"), JSON.parse]) })
    ),
  ]);

const filterPayload = pipe([
  when(
    get("sessionPolicy"),
    assign({ sessionPolicy: pipe([get("sessionPolicy"), JSON.stringify]) })
  ),
]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RolesAnywhere.html
exports.RolesAnywhereProfile = () => ({
  type: "Profile",
  package: "rolesanywhere",
  client: "RolesAnywhere",
  propertiesDefault: {},
  omitProperties: [
    "profileId",
    "roleArns",
    "createdAt",
    "createdBy",
    "updatedAt",
  ],
  inferName: () =>
    pipe([
      get("name"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("name"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("profileArn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["ResourceNotFoundException"],
  managedByOther,
  cannotBeDeleted: managedByOther,
  dependencies: {
    managedPolicies: {
      type: "Policy",
      group: "IAM",
      list: true,
      dependencyIds: ({ lives, config }) => pipe([get("managedPolicyArns")]),
    },
    iamRoles: {
      type: "Role",
      group: "IAM",
      list: true,
      dependencyIds: ({ lives, config }) => pipe([get("roleArns")]),
    },
  },
  filterLive: ({ lives, providerConfig }) =>
    pipe([
      assign({
        managedPolicyArns: pipe([
          get("managedPolicyArns"),
          map(
            replaceAccountAndRegion({
              providerConfig,
              lives,
            })
          ),
        ]),
      }),
    ]),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RolesAnywhere.html#getProfile-property
  getById: {
    method: "getProfile",
    getField: "profile",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RolesAnywhere.html#listProfiles-property
  getList: {
    method: "listProfiles",
    getParam: "profiles",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RolesAnywhere.html#createProfile-property
  create: {
    filterPayload,
    method: "createProfile",
    pickCreated: ({ payload }) => pipe([get("profile")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RolesAnywhere.html#updateProfile-property
  //TODO  disableProfile
  update: {
    method: "updateProfile",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, filterPayload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RolesAnywhere.html#deleteProfile-property
  destroy: {
    method: "deleteProfile",
    pickId,
  },
  getByName: getByNameCore,
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  configDefault: ({
    name,
    namespace,
    properties: { tags, ...otherProps },
    dependencies: { iamRoles },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        tags: buildTags({
          name,
          config,
          namespace,
          UserTags: tags,
          key: "key",
          value: "value",
        }),
      }),
      when(
        () => iamRoles,
        assign({
          roleArns: pipe([
            () => iamRoles,
            map((role) => getField(role, "Arn")),
          ]),
        })
      ),
      when(
        () => managedPolicies,
        assign({
          managedPolicyArns: pipe([
            () => managedPolicies,
            map((policy) => getField(policy, "Arn")),
          ]),
        })
      ),
    ])(),
});
