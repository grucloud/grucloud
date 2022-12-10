const assert = require("assert");
const { pipe, tap, get, pick, eq, assign, omit, map } = require("rubico");
const { defaultsDeep, pluck } = require("rubico/x");

const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTags } = require("../AwsCommon");
const { getByNameCore } = require("@grucloud/core/Common");

const { Tagger, listTagsForResource } = require("./DMSCommon");

const buildArn = () =>
  pipe([
    get("Arn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ ReplicationSubnetGroupIdentifier }) => {
    assert(ReplicationSubnetGroupIdentifier);
  }),
  pick(["ReplicationSubnetGroupIdentifier"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    assign({
      Arn: pipe([
        ({ ReplicationSubnetGroupIdentifier }) =>
          `arn:aws:dms:${
            config.region
          }:${config.accountId()}:subgrp:${ReplicationSubnetGroupIdentifier}`,
      ]),
    }),
    assign({ SubnetIds: pipe([get("Subnets"), pluck("SubnetIdentifier")]) }),
    omit(["Subnets"]),
    listTagsForResource({ endpoint, buildArn: buildArn() }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DMS.html
exports.DMSReplicationSubnetGroup = ({ compare }) => ({
  type: "ReplicationSubnetGroup",
  package: "database-migration-service",
  client: "DatabaseMigrationService",
  propertiesDefault: {},
  omitProperties: ["Arn", "VpcId", "SubnetGroupStatus", "SubnetIds"],
  inferName: () =>
    pipe([
      get("ReplicationSubnetGroupIdentifier"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("ReplicationSubnetGroupIdentifier"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("ReplicationSubnetGroupIdentifier"),
      tap((id) => {
        assert(id);
      }),
    ]),
  dependencies: {
    subnets: {
      type: "Subnet",
      group: "EC2",
      list: true,
      dependencyIds: ({ lives, config }) => pipe([get("SubnetIds")]),
    },
  },
  ignoreErrorCodes: ["ResourceNotFoundFault"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DMS.html#describeReplicationSubnetGroups-property
  getById: {
    method: "describeReplicationSubnetGroups",
    getField: "ReplicationSubnetGroups",
    pickId: pipe([
      tap(({ ReplicationSubnetGroupIdentifier }) => {
        assert(ReplicationSubnetGroupIdentifier);
      }),
      ({ ReplicationSubnetGroupIdentifier }) => ({
        Filters: [
          {
            Name: "replication-subnet-group-id",
            Values: [ReplicationSubnetGroupIdentifier],
          },
        ],
      }),
    ]),
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DMS.html#describeReplicationSubnetGroups-property
  getList: {
    method: "describeReplicationSubnetGroups",
    getParam: "ReplicationSubnetGroups",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DMS.html#createReplicationSubnetGroup-property
  create: {
    method: "createReplicationSubnetGroup",
    pickCreated: ({ payload }) => pipe([get("ReplicationSubnetGroup")]),
    isInstanceUp: pipe([eq(get("SubnetGroupStatus"), "Complete")]),
    shouldRetryOnExceptionMessages: ["is not configured properly"],
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DMS.html#modifyReplicationSubnetGroup-property
  update: {
    method: "modifyReplicationSubnetGroup",
    filterParams: ({ pickId, payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DMS.html#deleteReplicationSubnetGroup-property
  destroy: {
    method: "deleteReplicationSubnetGroup",
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
    dependencies: { subnets },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        Tags: buildTags({ name, config, namespace, UserTags: Tags }),
        SubnetIds: pipe([
          () => subnets,
          map((subnet) => getField(subnet, "SubnetId")),
        ])(),
      }),
    ])(),
});
