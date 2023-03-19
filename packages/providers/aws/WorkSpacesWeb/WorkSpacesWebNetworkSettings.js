const assert = require("assert");
const { pipe, tap, get, pick, map } = require("rubico");
const { defaultsDeep, identity, when } = require("rubico/x");
const { getField } = require("@grucloud/core/ProviderCommon");

const { getByNameCore } = require("@grucloud/core/Common");
const { buildTags } = require("../AwsCommon");

const {
  Tagger,
  assignTags,
  associate,
  disassociate,
} = require("./WorkSpacesWebCommon");

const buildArn = () =>
  pipe([
    get("networkSettingsArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ networkSettingsArn }) => {
    assert(networkSettingsArn);
  }),
  pick(["networkSettingsArn"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    assignTags({ buildArn: buildArn(config), endpoint }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/WorkSpacesWeb.html
exports.WorkSpacesWebNetworkSettings = () => ({
  type: "NetworkSettings",
  package: "workspaces-web",
  client: "WorkSpacesWeb",
  propertiesDefault: {},
  omitProperties: [
    "networkSettingsArn",
    "associatedPortalArns",
    "vpcId",
    "subnetIds",
    "securityGroupIds",
  ],
  inferName:
    ({ dependenciesSpec: { vpc } }) =>
    ({}) =>
      pipe([
        tap((params) => {
          assert(vpc);
        }),
        () => vpc,
      ])(),
  findName:
    ({ lives, config }) =>
    ({ vpcId }) =>
      pipe([
        tap(() => {
          assert(vpcId);
        }),
        () => vpcId,
        lives.getById({
          type: "Vpc",
          group: "EC2",
          providerName: config.providerName,
        }),
        get("name", vpcId),
        tap((name) => {
          assert(name);
        }),
      ])(),
  findId: () =>
    pipe([
      get("networkSettingsArn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["ResourceNotFoundException"],
  dependencies: {
    portals: {
      type: "Portal",
      group: "WorkSpacesWeb",
      list: true,
      dependencyIds: ({ lives, config }) => pipe([get("associatedPortalArns")]),
    },
    subnets: {
      type: "Subnet",
      group: "EC2",
      list: true,
      dependencyIds: ({ lives, config }) => pipe([get("subnetIds")]),
    },
    securityGroups: {
      type: "SecurityGroup",
      group: "EC2",
      list: true,
      dependencyIds: ({ lives, config }) => pipe([get("securityGroupIds")]),
    },
    vpc: {
      type: "Vpc",
      group: "EC2",
      parent: true,
      dependencyId: ({ lives, config }) => pipe([get("vpcId")]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/WorkSpacesWeb.html#getNetworkSettings-property
  getById: {
    method: "getNetworkSettings",
    getField: "networkSettings",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/WorkSpacesWeb.html#listNetworkSettingss-property
  getList: {
    method: "listNetworkSettings",
    getParam: "networkSettings",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/WorkSpacesWeb.html#createNetworkSettings-property
  create: {
    method: "createNetworkSettings",
    pickCreated: ({ payload }) => pipe([identity]),
    postCreate: ({ endpoint, resolvedDependencies: { portals } }) =>
      pipe([
        associate({
          endpoint,
          portals,
          method: "associateNetworkSettings",
          arnKey: "networkSettingsArn",
        }),
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/WorkSpacesWeb.html#updateNetworkSettings-property
  update: {
    method: "updateNetworkSettings",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/WorkSpacesWeb.html#deleteNetworkSettings-property
  destroy: {
    preDestroy: ({ endpoint }) =>
      tap(
        disassociate({
          endpoint,
          method: "disassociateNetworkSettings",
        })
      ),
    method: "deleteNetworkSettings",
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
    dependencies: { securityGroups, subnets, vpc },
    config,
  }) =>
    pipe([
      tap(() => {
        assert(vpc);
        assert(subnets);
      }),
      () => otherProps,
      defaultsDeep({
        tags: buildTags({ name, config, namespace, UserTags: tags }),
        subnetIds: pipe([
          () => subnets,
          map((subnet) => getField(subnet, "SubnetId")),
        ])(),
        vpcId: getField(vpc, "VpcId"),
      }),
      when(
        () => securityGroups,
        defaultsDeep({
          securityGroupIds: pipe([
            () => securityGroups,
            map((securityGroup) => getField(securityGroup, "GroupId")),
          ])(),
        })
      ),
    ])(),
});
