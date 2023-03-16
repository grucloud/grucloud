const assert = require("assert");
const {
  get,
  pipe,
  map,
  eq,
  or,
  tap,
  pick,
  filter,
  not,
  omit,
  fork,
  switchCase,
  assign,
} = require("rubico");
const {
  identity,
  find,
  defaultsDeep,
  isEmpty,
  append,
  prepend,
  first,
  unless,
  differenceWith,
  callProp,
  last,
  when,
} = require("rubico/x");
const { getField } = require("@grucloud/core/ProviderCommon");

const logger = require("@grucloud/core/logger")({ prefix: "EC2SecurityGroup" });

const { hasKeyInTags, findEksCluster } = require("../AwsCommon");

const { omitIfEmpty } = require("@grucloud/core/Common");
const {
  buildTags,
  revokeSecurityGroupIngress,
  destroyNetworkInterfaces,
  arnFromId,
} = require("../AwsCommon");

const { addIcmpPorts } = require("./EC2SecurityGroupRule");

const {
  tagResource,
  untagResource,
  findDefaultWithVpcDependency,
} = require("./EC2Common");

const findName =
  ({ lives, config }) =>
  (live) =>
    pipe([
      tap(() => {
        assert(lives);
        assert(live.GroupName);
      }),
      () => live,
      get("VpcId"),
      lives.getById({
        type: "Vpc",
        group: "EC2",
        providerName: config.providerName,
      }),
      tap((vpc) => {
        //assert(vpc);
      }),
      get("name", live.VpcId),
      tap((vpcName) => {
        assert(vpcName);
      }),
      append("::"),
      append(live.GroupName),
      prepend("sg::"),
    ])();

const findId = () => get("GroupId");

const cannotBeDeleted = () =>
  pipe([
    or([
      eq(get("GroupName"), "default"),
      //pipe([get("Tags"), find(eq(get("Key"), "aws:eks:cluster-name"))]),
    ]),
  ]);

const managedByOther = ({ lives, config }) =>
  or([
    pipe([
      get("Description"),
      callProp("startsWith", "AWS created security group"),
    ]), // Directory Service
    pipe([get("GroupName"), callProp("startsWith", "cloudhsm-cluster-")]), // CloudHSM
    pipe([get("GroupName"), callProp("startsWith", "aws-cloud9-")]), // Cloud9
    // WorkSpaces
    pipe([
      get("Description"),
      callProp("startsWith", "Amazon WorkSpaces Security Group"),
    ]),
    hasKeyInTags({
      key: "aws:eks:cluster-name",
    }),
    hasKeyInTags({
      key: "elbv2.k8s.aws/cluster",
    }),
    hasKeyInTags({
      key: "AWSServiceName",
    }),
    hasKeyInTags({
      key: "elasticbeanstalk:",
    }),
    cannotBeDeleted({ lives, config }),
  ]);

const pickId = pipe([
  tap(({ GroupId }) => {
    assert(GroupId);
  }),
  pick(["GroupId"]),
]);

const assignArn = ({ config }) =>
  assign({
    Arn: pipe([
      get("GroupId"),
      prepend("security-group/"),
      arnFromId({ service: "ec2", config }),
    ]),
  });

const decorate = ({ config }) =>
  pipe([
    assign({
      IpPermissions: pipe([
        get("IpPermissions"),
        callProp(
          "sort",
          (
            { FromPort: FromPortA = "-1", IpProtocol: IpProtocolA },
            { FromPort: FromPortB = "-1", IpProtocol: IpProtocolB }
          ) =>
            `${FromPortA}${IpProtocolA}`.localeCompare(
              `${FromPortB}${IpProtocolB}`
            )
        ),
      ]),
    }),
    assignArn({ config }),
  ]);

// const findNamespace = (param) =>
//   pipe([
//     () => [
//       findNamespaceInTagsOrEksCluster({
//         config,
//         key: "aws:eks:cluster-name",
//       })(param),
//       findNamespaceInTagsOrEksCluster({
//         config,
//         key: "elbv2.k8s.aws/cluster",
//       })(param),
//     ],
//     find(not(isEmpty)),
//     tap((namespace) => {
//       logger.debug(`findNamespace ${namespace}`);
//     }),
//   ])();

const extractGroupName = pipe([callProp("split", "::"), last]);

const ipPermissionsEquals = (a, b) =>
  a.FromPort === b.FromPort &&
  a.ToPort === b.ToPort &&
  a.IpProtocol &&
  b.IpProtocol;

const revokePermissionDelete =
  ({ types, method, endpoint }) =>
  ({ target, live, liveIn }) =>
    pipe([
      tap((params) => {
        assert(types);
        assert(target);
        assert(live);
        assert(liveIn);
        assert(liveIn.GroupId);
        assert(method);
      }),
      () => target[types],
      differenceWith(ipPermissionsEquals, live[types]),
      unless(
        isEmpty,
        pipe([
          tap((params) => {
            assert(true);
          }),
          (IpPermissions) =>
            endpoint()[method]({
              GroupId: liveIn.GroupId,
              IpPermissions,
            }),
        ])
      ),
    ])();

const revokeIngressRules =
  ({ endpoint }) =>
  (live) =>
    pipe([
      tap(() => {
        logger.debug(`revokeIngressRules`);
      }),
      () => live,
      get("IpPermissions"),
      filter(pipe([get("UserIdGroupPairs"), not(isEmpty)])),
      map(
        pipe([
          omit(["IpRanges", "Ipv6Ranges", "PrefixListIds"]),
          (ipPermission) => ({
            GroupId: live.GroupId,
            IpPermissions: [ipPermission],
          }),
          revokeSecurityGroupIngress({ endpoint }),
        ])
      ),
    ])();

const sortByFromPort = pipe([
  callProp("sort", (a, b) => a.FromPort - b.FromPort),
]);

const getIpPermissions =
  ({ type, targetResources, lives, config }) =>
  ({ GroupName, VpcId }) =>
    pipe([
      tap(() => {
        assert(type);
        assert(targetResources);
        assert(lives);
        assert(GroupName);
        assert(VpcId);
        assert(config);
      }),
      () => targetResources,
      tap((params) => {
        assert(Array.isArray(targetResources));
      }),
      filter(eq(get("type"), type)),
      filter(
        eq(
          ({ dependencies }) =>
            pipe([
              dependencies,
              get("securityGroup.name"),
              callProp("split", "::"),
              ([sg, vpcName]) =>
                pipe([
                  () => vpcName,
                  lives.getByName({
                    type: "Vpc",
                    group: "EC2",
                    providerName: config.providerName,
                  }),
                  get("id"),
                ])(),
              tap((vpcName) => {
                assert(vpcName);
              }),
            ])(),
          VpcId
        )
      ),
      filter(
        eq(
          ({ dependencies }) =>
            pipe([
              dependencies,
              get("securityGroup.name"),
              callProp("split", "::"),
              last,
            ])(),
          GroupName
        )
      ),
      map(({ properties }) =>
        pipe([() => properties({}), addIcmpPorts, omit(["UserIdGroupPairs"])])()
      ),
      sortByFromPort,
    ])();

const filterPermissions = pipe([
  map(
    pipe([
      omitIfEmpty(["PrefixListIds", "Ipv6Ranges", "IpRanges"]),
      omit(["UserIdGroupPairs"]),
    ])
  ),
  sortByFromPort,
]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html
exports.EC2SecurityGroup = ({ compare }) => ({
  type: "SecurityGroup",
  package: "ec2",
  client: "EC2",
  propertiesDefault: {},
  omitProperties: [],
  inferName:
    ({ resourceName, properties, dependenciesSpec: { vpc } }) =>
    ({ GroupName }) =>
      pipe([
        tap((params) => {
          assert(vpc);
        }),
        () => resourceName,
        when(
          isEmpty,
          pipe([
            () => "sg::",
            when(() => vpc, append(`${vpc}::`)),
            switchCase([() => GroupName, append(GroupName), append("default")]),
          ])
        ),
      ])(),
  findName,
  findId,
  findDefault: findDefaultWithVpcDependency,
  compare: compare({
    filterTarget: ({ lives, config, targetResources }) =>
      pipe([
        tap((params) => {
          assert(targetResources);
          assert(lives);
        }),
        assign({
          IpPermissions: getIpPermissions({
            type: "SecurityGroupRuleIngress",
            targetResources,
            lives,
            config,
          }),
          IpPermissionsEgress: getIpPermissions({
            type: "SecurityGroupRuleEgress",
            targetResources,
            lives,
            config,
          }),
        }),
      ]),
    filterLive: () =>
      pipe([
        assign({
          IpPermissions: pipe([get("IpPermissions"), filterPermissions]),
          IpPermissionsEgress: pipe([
            get("IpPermissionsEgress"),
            filterPermissions,
            filter(
              pipe([
                tap((params) => {
                  assert(true);
                }),
                not(eq(get("IpProtocol"), "-1")),
                // assign({
                //   IpRanges: pipe([
                //     get("IpRanges"),
                //     map(omit(["Description"])),
                //   ]),
                // }),
                // (rule) =>
                //   !isDeepEqual(rule, {
                //     FromPort: undefined,
                //     IpProtocol: "-1",
                //     IpRanges: [{ CidrIp: "0.0.0.0/0" }],
                //     ToPort: undefined,
                //   }),
              ])
            ),
          ]),
        }),
      ]),
    filterAll: () => pipe([omit(["Arn", "VpcId", "OwnerId", "GroupId"])]),
  }),
  filterLive: () => pick(["GroupName", "Description"]),
  dependencies: {
    vpc: {
      type: "Vpc",
      group: "EC2",
      parent: true,
      parentForName: true,
      dependencyId: ({ lives, config }) => get("VpcId"),
    },
    eksCluster: {
      type: "Cluster",
      group: "EKS",
      ignoreOnDestroy: true,
      dependencyId: ({ lives, config }) =>
        pipe([findEksCluster({ config, lives }), get("id")]),
    },
  },
  addCode: ({ resource, lives }) =>
    pipe([
      () => resource,
      get("dependencies"),
      find(eq(get("type"), "Cluster")),
      get("ids"),
      first,
      unless(isEmpty, (id) =>
        pipe([
          () => lives,
          find(eq(get("id"), id)),
          get("name"),
          tap((name) => {
            assert(name, "cannot found cluster");
          }),
          (name) => `
                filterLives: ({ resources }) =>
                  pipe([
                    () => resources,
                    find(
                      pipe([
                        get("live.Tags"),
                        find(
                          and([
                            eq(get("Key"), "aws:eks:cluster-name"),
                            eq(get("Value"), "${name}"),
                          ])
                        ),
                      ])
                    ),
                  ])(),`,
        ])()
      ),
    ])(),
  ignoreErrorCodes: ["InvalidGroup.NotFound"],
  cannotBeDeleted,
  isDefault: cannotBeDeleted,
  managedByOther,
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#getSecurityGroup-property
  getById: {
    pickId: ({ GroupId }) => ({ GroupIds: [GroupId] }),
    method: "describeSecurityGroups",
    getField: "SecurityGroups",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#listSecurityGroups-property
  getList: {
    method: "describeSecurityGroups",
    getParam: "SecurityGroups",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#createSecurityGroup-property
  create: {
    method: "createSecurityGroup",
    pickCreated: ({ payload }) => pipe([identity]),
  },
  update:
    ({ endpoint }) =>
    async ({ diff }) =>
      pipe([
        () => diff,
        fork({
          ingress: pipe([
            revokePermissionDelete({
              endpoint,
              types: "IpPermissions",
              method: "revokeSecurityGroupIngress",
            }),
          ]),
          egress: pipe([
            revokePermissionDelete({
              endpoint,
              types: "IpPermissionsEgress",
              method: "revokeSecurityGroupEgress",
            }),
          ]),
        }),
      ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#deleteSecurityGroup-property
  destroy: {
    preDestroy: ({ endpoint }) =>
      tap(
        pipe([
          tap(revokeIngressRules({ endpoint })),
          ({ GroupId }) => ({
            Name: "group-id",
            Values: [GroupId],
          }),
          destroyNetworkInterfaces({ endpoint }),
        ])
      ),
    pickId,
    method: "deleteSecurityGroup",
  },
  getByName:
    ({ endpoint, getList }) =>
    ({ name, resolvedDependencies, config }) =>
      pipe([
        tap(() => {
          assert(config);
          assert(getList);
          assert(resolvedDependencies);
        }),
        fork({
          groupName: pipe([() => name, extractGroupName]),
          vpcId: pipe([
            () => resolvedDependencies,
            switchCase([
              get("vpc"),
              get("vpc.live.VpcId"),
              get("securityGroup"),
              get("securityGroup.live.VpcId"),
              () => {
                assert(false, "SecurityGroup getByName, dependency error");
              },
            ]),
          ]),
        }),
        tap(({ vpcId, groupName }) => {
          assert(vpcId);
          assert(groupName);
        }),
        ({ groupName, vpcId }) => ({
          Filters: [
            {
              Name: "group-name",
              Values: [groupName],
            },
            {
              Name: "vpc-id",
              Values: [vpcId],
            },
          ],
        }),
        endpoint().describeSecurityGroups,
        get("SecurityGroups"),
        first,
        unless(isEmpty, decorate({ config })),
        tap((securityGroup) => {
          logger.debug(`getByName ${name}: ${JSON.stringify(securityGroup)}`);
        }),
      ])(),
  tagger: ({ config }) => ({
    tagResource,
    untagResource,
  }),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { vpc },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(vpc);
      }),
      () => ({}),
      defaultsDeep(otherProps),
      defaultsDeep({
        GroupName: name,
        VpcId: getField(vpc, "VpcId"),
        TagSpecifications: [
          {
            ResourceType: "security-group",
            Tags: buildTags({ config, namespace, name, UserTags: Tags }),
          },
        ],
      }),
    ])(),
});
