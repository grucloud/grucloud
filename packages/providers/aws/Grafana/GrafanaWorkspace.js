const assert = require("assert");
const { pipe, tap, get, pick, eq, assign, map, omit } = require("rubico");
const { defaultsDeep, when, unless } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTagsObject } = require("@grucloud/core/Common");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Grafana.html

const { Tagger } = require("./GrafanaCommon");

const buildArn = () =>
  pipe([
    get("arn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ workspaceId }) => {
    assert(workspaceId);
  }),
  pick(["workspaceId"]),
]);

const idToWorkspaceId = ({ id, ...other }) => ({
  workspaceId: id,
  ...other,
});

const assignArn = ({ config }) =>
  pipe([
    assign({
      arn: pipe([
        tap(({ workspaceName }) => {
          assert(workspaceName);
        }),
        ({ workspaceName }) =>
          `arn:${config.partition}:grafana:${
            config.region
          }:${config.accountId()}:workspace/${workspaceName}`,
      ]),
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Grafana.html#describeWorkspaceAuthentication-property
const assignAuthentication = ({ endpoint }) =>
  pipe([
    assign({
      authentication: pipe([
        pickId,
        endpoint().describeWorkspaceAuthentication,
      ]),
    }),
  ]);

const omitFreeTrialLicence = unless(
  eq(get("licenseType"), "ENTERPRISE"),
  omit(["licenseType"])
);
// Decorate
const decorate = ({ endpoint, config }) =>
  pipe([
    ({
      name,
      description,
      dataSources,
      authentication,
      notificationDestinations,
      organizationalUnits,
      ...other
    }) => ({
      workspaceName: name,
      workspaceDescription: description,
      authenticationProviders: authentication.providers,
      workspaceDataSources: dataSources,
      workspaceNotificationDestinations: notificationDestinations,
      workspaceOrganizationalUnits: organizationalUnits,
      ...other,
    }),
    idToWorkspaceId,
    assignArn({ config }),
    assignAuthentication({ endpoint }),
    omitFreeTrialLicence,
  ]);

//https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Grafana.html#associateLicense-property
const associateLicense = ({ endpoint }) =>
  pipe([
    tap(({ workspaceId, licenseType }) => {
      assert(workspaceId);
      assert(licenseType);
    }),
    endpoint().associateLicense,
  ]);

const disassociateLicense = ({ endpoint }) =>
  pipe([
    tap(({ workspaceId, licenseType }) => {
      assert(workspaceId);
      assert(licenseType);
    }),
    endpoint().disassociateLicense,
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Grafana.html
exports.GrafanaWorkspace = () => ({
  type: "Workspace",
  package: "grafana",
  client: "Grafana",
  propertiesDefault: {},
  omitProperties: [
    "workspaceId",
    "arn",
    "modified",
    "endpoint",
    "created",
    "status",
    "freeTrialConsumed",
    "freeTrialExpiration",
    "grafanaVersion",
    "licenseExpiration",
    "workspaceOrganizationalUnits",
    "authentication.samlConfigurationStatus",
    "workspaceRoleArn",
    "vpcConfiguration",
    "authentication",
    "networkAccessControl",
  ],
  inferName: () =>
    pipe([
      get("workspaceName"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("workspaceName"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("workspaceId"),
      tap((id) => {
        assert(id);
      }),
    ]),
  dependencies: {
    workspaceRole: {
      type: "Role",
      group: "IAM",
      dependencyId: ({ lives, config }) => pipe([get("workspaceRoleArn")]),
    },
    organizationalUnits: {
      type: "OrganizationalUnit",
      group: "Organisations",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([get("workspaceOrganizationalUnits")]),
    },
    subnets: {
      type: "Subnet",
      group: "EC2",
      list: true,
      dependencyIds: ({ lives, config }) => get("vpcConfiguration.subnetIds"),
    },
    securityGroups: {
      type: "SecurityGroup",
      group: "EC2",
      list: true,
      dependencyIds: ({ lives, config }) =>
        get("vpcConfiguration.securityGroupIds"),
    },
    prefixLists: {
      type: "ManagedPrefixList",
      group: "EC2",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([get("networkAccessControl.prefixListIds")]),
    },
    vpcEndpoints: {
      type: "VpcEndpoint",
      group: "EC2",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([get("networkAccessControl.vpceIds")]),
    },
  },
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Grafana.html#describeWorkspace-property
  getById: {
    method: "describeWorkspace",
    getField: "workspace",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Grafana.html#listWorkspaces-property
  getList: {
    method: "listWorkspaces",
    getParam: "workspaces",
    decorate: ({ getById }) => pipe([idToWorkspaceId, getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Grafana.html#createWorkspace-property
  create: {
    method: "createWorkspace",
    pickCreated: ({ payload }) => pipe([get("workspace"), idToWorkspaceId]),
    isInstanceUp: pipe([eq(get("status"), "ACTIVE")]),
    isInstanceError: pipe([eq(get("Status"), "CREATION_FAILED")]),
    postCreate:
      ({ endpoint, payload, created }) =>
      (live) =>
        pipe([
          () => payload,
          tap.if(
            eq(get("licenseType"), "ENTERPRISE"),
            pipe([associateLicense({ endpoint })])
          ),
        ])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Grafana.html#updateWorkspace-property
  update: {
    // TODO preUpdate disassociateLicense
    method: "updateWorkspace",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep({ workspaceId: live.workspaceId })])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Grafana.html#deleteWorkspace-property
  destroy: {
    method: "deleteWorkspace",
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
    dependencies: {
      subnets,
      securityGroups,
      workspaceRole,
      organizationalUnits,
      prefixLists,
      vpcEndpoints,
    },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        tags: buildTagsObject({ name, config, namespace, userTags: tags }),
      }),
      when(
        () => workspaceRole,
        assign({ workspaceRoleArn: () => getField(workspaceRole, "Arn") })
      ),
      when(
        () => organizationalUnits,
        defaultsDeep({
          workspaceOrganizationalUnits: pipe([
            () => organizationalUnits,
            map((ou) => getField(ou, "Id")),
          ])(),
        })
      ),
      when(
        () => subnets,
        defaultsDeep({
          vpcConfiguration: {
            subnetIds: pipe([
              () => subnets,
              map((subnet) => getField(subnet, "SubnetId")),
            ])(),
          },
        })
      ),
      when(
        () => securityGroups,
        defaultsDeep({
          vpcConfiguration: {
            securityGroupIds: pipe([
              () => securityGroups,
              map((securityGroup) => getField(securityGroup, "GroupId")),
            ])(),
          },
        })
      ),
      when(
        () => prefixLists,
        defaultsDeep({
          networkAccessControl: {
            prefixListIds: pipe([
              () => prefixLists,
              map((prefixList) => getField(prefixList, "PrefixListId")),
            ])(),
          },
        })
      ),
      when(
        () => vpcEndpoints,
        defaultsDeep({
          networkAccessControl: {
            prefixListIds: pipe([
              () => vpcEndpoints,
              map((vpcEndpoint) => getField(vpcEndpoint, "VpcEndpointId")),
            ])(),
          },
        })
      ),
      tap((params) => {
        assert(true);
      }),
    ])(),
});
