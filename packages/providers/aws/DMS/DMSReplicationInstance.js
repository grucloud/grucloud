const assert = require("assert");
const { pipe, tap, get, pick, eq, assign, omit, map } = require("rubico");
const { defaultsDeep, pluck, when } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");

const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTags } = require("../AwsCommon");

const { Tagger, listTagsForResource } = require("./DMSCommon");

const buildArn = () =>
  pipe([
    get("ReplicationInstanceArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ ReplicationInstanceArn }) => {
    assert(ReplicationInstanceArn);
  }),
  pick(["ReplicationInstanceArn"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    assign({
      Arn: pipe([
        ({ ReplicationInstanceIdentifier }) =>
          `arn:aws:dms:${
            config.region
          }:${config.accountId()}:rep:${ReplicationInstanceIdentifier}`,
      ]),
      ReplicationSubnetGroupIdentifier: pipe([
        get("ReplicationSubnetGroup.ReplicationSubnetGroupIdentifier"),
      ]),
      VpcSecurityGroupIds: pipe([
        get("VpcSecurityGroups"),
        pluck("VpcSecurityGroupId"),
      ]),
    }),
    omit(["VpcSecurityGroups", "ReplicationSubnetGroup"]),
    listTagsForResource({ endpoint, buildArn: buildArn() }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DMS.html
exports.DMSReplicationInstance = ({ compare }) => ({
  type: "ReplicationInstance",
  package: "database-migration-service",
  client: "DatabaseMigrationService",
  propertiesDefault: {},
  omitProperties: [
    "Arn",
    "ReplicationInstanceStatus",
    "InstanceCreateTime",
    "PendingModifiedValues",
    "KmsKeyId",
    "ReplicationSubnetGroupIdentifier",
    "ReplicationInstanceArn",
    "ReplicationInstancePublicIpAddress",
    "ReplicationInstancePrivateIpAddress",
    "ReplicationInstancePublicIpAddresses",
    "ReplicationInstancePrivateIpAddresses",
    "ReplicationInstanceIpv6Addresses",
    "SecondaryAvailabilityZone",
    "FreeUntil",
    "DnsNameServers",
    "VpcSecurityGroupIds",
  ],
  inferName: () =>
    pipe([
      get("ReplicationInstanceIdentifier"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("ReplicationInstanceIdentifier"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("ReplicationInstanceArn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  dependencies: {
    kmsKey: {
      type: "Key",
      group: "KMS",
      excludeDefaultDependencies: true,
      dependencyId: ({ lives, config }) => pipe([get("KmsKeyId")]),
    },
    subnetGroup: {
      type: "ReplicationSubnetGroup",
      group: "DMS",
      dependencyId: ({ lives, config }) =>
        pipe([get("ReplicationSubnetGroupIdentifier")]),
    },
    securityGroups: {
      type: "SecurityGroup",
      group: "EC2",
      list: true,
      dependencyIds: ({ lives, config }) => get("VpcSecurityGroupIds"),
    },
  },
  ignoreErrorCodes: ["ResourceNotFoundFault"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DMS.html#describeReplicationInstances-property
  getById: {
    method: "describeReplicationInstances",
    getField: "ReplicationInstances",
    pickId: pipe([
      tap(({ ReplicationInstanceArn }) => {
        assert(ReplicationInstanceArn);
      }),
      ({ ReplicationInstanceArn }) => ({
        Filters: [
          {
            Name: "replication-instance-arn",
            Values: [ReplicationInstanceArn],
          },
        ],
      }),
    ]),
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DMS.html#describeReplicationInstances-property
  getList: {
    method: "describeReplicationInstances",
    getParam: "ReplicationInstances",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DMS.html#createReplicationInstance-property
  create: {
    method: "createReplicationInstance",
    pickCreated: ({ payload }) => pipe([get("ReplicationInstance")]),
    isInstanceUp: pipe([eq(get("ReplicationInstanceStatus"), "available")]),
    isInstanceError: pipe([eq(get("ReplicationInstanceStatus"), "failed")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DMS.html#modifyReplicationInstance-property
  update: {
    method: "modifyReplicationInstance",
    filterParams: ({ pickId, payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DMS.html#deleteReplicationInstance-property
  destroy: {
    method: "deleteReplicationInstance",
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
    properties: { Tags, ...otherProps },
    dependencies: { kmsKey, securityGroups, subnetGroup },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        Tags: buildTags({ name, config, namespace, UserTags: Tags }),
      }),
      when(
        () => kmsKey,
        defaultsDeep({
          KmsKeyId: getField(kmsKey, "Arn"),
        })
      ),
      when(
        () => subnetGroup,
        defaultsDeep({
          ReplicationSubnetGroupIdentifier: getField(
            subnetGroup,
            "ReplicationSubnetGroupIdentifier"
          ),
        })
      ),
      when(
        () => securityGroups,
        defaultsDeep({
          VpcSecurityGroupIds: pipe([
            () => securityGroups,
            map((sg) => getField(sg, "GroupId")),
          ])(),
        })
      ),
    ])(),
});
