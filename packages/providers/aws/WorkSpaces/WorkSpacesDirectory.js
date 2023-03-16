const assert = require("assert");
const {
  pipe,
  tap,
  get,
  pick,
  eq,
  assign,
  map,
  switchCase,
  omit,
} = require("rubico");
const { defaultsDeep, when, unless, isEmpty } = require("rubico/x");
const { buildTags } = require("../AwsCommon");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const { Tagger, assignTags } = require("./WorkSpacesCommon");

const filterPayload = pipe([
  pick([
    "DirectoryId",
    "Tenancy",
    "EnableWorkDocs",
    "EnableSelfService",
    "SubnetIds",
    "Tags",
  ]),
]);

const buildArn = () =>
  pipe([
    get("DirectoryId"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ DirectoryId }) => {
    assert(DirectoryId);
  }),
  pick(["DirectoryId"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    ({ ipGroupIds, ...others }) => ({ GroupIds: ipGroupIds, ...others }),
    assignTags({ buildArn: buildArn(config), endpoint }),
    assign({
      EnableWorkDocs: pipe([get("WorkspaceCreationProperties.EnableWorkDocs")]),
      EnableSelfService: switchCase([
        get("SelfservicePermissions"),
        () => true,
        () => false,
      ]),
    }),
    when(
      eq(get("CertificateBasedAuthProperties.Status"), "DISABLED"),
      omit(["CertificateBasedAuthProperties"])
    ),
    when(
      eq(get("SamlProperties.Status"), "DISABLED"),
      omit(["SamlProperties"])
    ),
  ]);

const associateIpGroups = ({ endpoint, live, ipGroups }) =>
  pipe([
    tap(() => {
      assert(live.DirectoryId);
    }),
    () => ipGroups,
    unless(
      isEmpty,
      assign({
        GroupIds: pipe([
          () => ipGroups,
          map((ipGroup) => getField(ipGroup, "GroupId")),
        ]),
        DirectoryId: () => live.DirectoryId,
      }),
      endpoint().associateIpGroups
    ),
  ]);

const disassociateIpGroups = ({ endpoint }) =>
  pipe([
    tap(({ DirectoryId }) => {
      assert(DirectoryId);
    }),
    unless(
      pipe([get("GroupIds"), isEmpty]),
      pipe([pick(["GroupIds", "DirectoryId"]), endpoint().disassociateIpGroups])
    ),
  ]);

const modifySelfservicePermissions = ({ endpoint, live }) =>
  pipe([
    tap(({ SelfservicePermissions }) => {
      assert(SelfservicePermissions);
      assert(live.DirectoryId);
    }),
    unless(
      pipe([get("SelfservicePermissions"), isEmpty]),
      pipe([
        pick(["SelfservicePermissions"]),
        assign({
          ResourceId: () => live.DirectoryId,
        }),
        endpoint().modifySelfservicePermissions,
      ])
    ),
  ]);

const modifyWorkspaceAccessProperties = ({ endpoint, live }) =>
  pipe([
    tap(({ WorkspaceAccessProperties }) => {
      assert(WorkspaceAccessProperties);
      assert(live.DirectoryId);
    }),
    unless(
      pipe([get("WorkspaceAccessProperties"), isEmpty]),
      pipe([
        pick(["WorkspaceAccessProperties"]),
        assign({
          ResourceId: () => live.DirectoryId,
        }),
        endpoint().modifyWorkspaceAccessProperties,
      ])
    ),
  ]);

const modifyWorkspaceCreationProperties = ({ endpoint, live }) =>
  pipe([
    tap(({ WorkspaceCreationProperties }) => {
      assert(WorkspaceCreationProperties);
      assert(live.DirectoryId);
    }),
    pick(["WorkspaceCreationProperties"]),
    assign({
      ResourceId: () => live.DirectoryId,
    }),
    endpoint().modifyWorkspaceCreationProperties,
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/WorkSpaces.html
exports.WorkSpacesDirectory = () => ({
  type: "Directory",
  package: "workspaces",
  client: "WorkSpaces",
  propertiesDefault: { Tenancy: "SHARED" },
  omitProperties: [
    "DirectoryId",
    "Alias",
    "State",
    "IamRoleId",
    "SubnetIds",
    "RegistrationCode",
    "CustomerUserName",
    "DirectoryName",
    "DnsIpAddresses",
    "DirectoryType",
    "WorkspaceSecurityGroupId",
    "GroupIds",
    "WorkspaceCreationProperties.CustomSecurityGroupId",
    "WorkspaceProperties.UserVolumeSizeGib",
  ],
  inferName:
    ({ dependenciesSpec: { directory } }) =>
    () =>
      pipe([
        tap((params) => {
          assert(directory);
        }),
        () => `${directory}`,
      ])(),
  findName:
    ({ lives, config }) =>
    ({ DirectoryId }) =>
      pipe([
        tap(() => {
          assert(DirectoryId);
        }),
        () => DirectoryId,
        lives.getById({
          type: "Directory",
          group: "DirectoryService",
          providerName: config.providerName,
        }),
        get("name"),
        tap((name) => {
          assert(name);
        }),
      ])(),
  findId: () =>
    pipe([
      get("DirectoryId"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["ResourceNotFoundException"],
  dependencies: {
    directory: {
      type: "Directory",
      group: "DirectoryService",
      parent: true,
      dependencyId: ({ lives, config }) =>
        pipe([
          get("DirectoryId"),
          tap((id) => {
            assert(id);
          }),
        ]),
    },
    iamRole: {
      type: "Role",
      group: "IAM",
      dependencyId: ({ lives, config }) => pipe([get("IamRoleId")]),
    },
    ipGroups: {
      type: "IpGroup",
      group: "WorkSpaces",
      list: true,
      dependencyIds: ({ lives, config }) => get("GroupIds"),
    },
    subnets: {
      type: "Subnet",
      group: "EC2",
      list: true,
      dependencyIds: ({ lives, config }) => get("SubnetIds"),
    },
    customSecurityGroup: {
      type: "SecurityGroup",
      group: "EC2",
      dependencyId: ({ lives, config }) =>
        get("WorkspaceCreationProperties.CustomSecurityGroupId"),
    },
    // securityGroup: {
    //   type: "SecurityGroup",
    //   group: "EC2",
    //   dependencyId: ({ lives, config }) =>
    //     get("WorkspaceCreationProperties.CustomSecurityGroupId"),
    // },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/WorkSpaces.html#describeWorkspaceDirectories-property
  getById: {
    method: "describeWorkspaceDirectories",
    getField: "Directories",
    pickId: pipe([
      tap(({ DirectoryId }) => {
        assert(DirectoryId);
      }),
      ({ DirectoryId }) => ({ DirectoryIds: [DirectoryId] }),
    ]),
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/WorkSpaces.html#describeWorkspaceDirectories-property
  getList: {
    method: "describeWorkspaceDirectories",
    getParam: "Directories",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/WorkSpaces.html#registerWorkspaceDirectory-property
  create: {
    filterPayload,
    method: "registerWorkspaceDirectory",
    pickCreated: ({ payload }) => pipe([() => payload]),
    shouldRetryOnExceptionMessages: [
      "The specified directory is not in a valid state",
    ],
    isInstanceUp: pipe([eq(get("State"), "REGISTERED")]),
    isInstanceError: pipe([eq(get("State"), "ERROR")]),
    postCreate:
      ({ endpoint, payload, resolvedDependencies: { ipGroups } }) =>
      (live) =>
        pipe([
          () => payload,
          tap(associateIpGroups({ endpoint, live, ipGroups })),
          tap(modifySelfservicePermissions({ endpoint, live })),
          tap(modifyWorkspaceAccessProperties({ endpoint, live })),
          tap(modifyWorkspaceCreationProperties({ endpoint, live })),
        ])(),
  },
  // TODO  update
  // TODO  postcreate and update
  // ModifySelfservicePermissions
  // ModifyWorkspaceAccessPropertiesWithContext
  // ModifyWorkspaceCreationPropertiesWithContext
  // AssociateIpGroupsWithContext

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/WorkSpaces.html#deregisterWorkspaceDirectory-property
  destroy: {
    preDestroy: ({ endpoint }) =>
      pipe([tap(disassociateIpGroups({ endpoint }))]),
    method: "deregisterWorkspaceDirectory",
    pickId,
    isInstanceUp: pipe([eq(get("State"), "DEREGISTERED")]),
    shouldRetryOnExceptionMessages: [
      "There are WorkSpaces assigned to this directory. You must remove the WorkSpaces before you deregister the directory",
    ],
  },
  getByName: getByNameCore,
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: {
      customSecurityGroup,
      directory,
      //securityGroup,
      subnets,
    },
    config,
  }) =>
    pipe([
      tap(() => {
        assert(directory);
      }),
      () => otherProps,
      defaultsDeep({
        Tags: buildTags({ name, config, namespace, UserTags: Tags }),
        DirectoryId: getField(directory, "DirectoryId"),
      }),
      when(
        () => customSecurityGroup,
        defaultsDeep({
          WorkspaceCreationProperties: {
            CustomSecurityGroupId: getField(customSecurityGroup, "GroupId"),
          },
        })
      ),
      // when(
      //   () => securityGroup,
      //   defaultsDeep({
      //     WorkspaceSecurityGroupId: getField(securityGroup, "GroupId"),
      //   })
      // ),
      when(
        () => subnets,
        defaultsDeep({
          SubnetIds: pipe([
            () => subnets,
            map((subnet) => getField(subnet, "SubnetId")),
          ])(),
        })
      ),
    ])(),
});
