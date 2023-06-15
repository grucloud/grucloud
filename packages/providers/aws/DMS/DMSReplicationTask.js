const assert = require("assert");
const { pipe, tap, get, pick, eq, assign, omit, map } = require("rubico");
const { defaultsDeep, pluck, when } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");

const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTags } = require("../AwsCommon");

const { Tagger, listTagsForResource } = require("./DMSCommon");

const buildArn = () =>
  pipe([
    get("ReplicationTaskArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ ReplicationTaskArn }) => {
    assert(ReplicationTaskArn);
  }),
  pick(["ReplicationTaskArn"]),
]);

const ReplicationTaskSettingsStringify = pipe([
  assign({
    ReplicationTaskSettings: pipe([
      get("ReplicationTaskSettings"),
      JSON.stringify,
    ]),
  }),
]);

const TableMappingsStringify = pipe([
  assign({
    TableMappings: pipe([get("TableMappings"), JSON.stringify]),
  }),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    assign({
      Arn: pipe([
        ({ ReplicationTaskIdentifier }) =>
          `arn:${config.partition}:dms:${
            config.region
          }:${config.accountId()}:task:${ReplicationTaskIdentifier}`,
      ]),
    }),
    listTagsForResource({ endpoint, buildArn: buildArn() }),
    assign({
      ReplicationTaskSettings: pipe([
        get("ReplicationTaskSettings"),
        tap((params) => {
          assert(true);
        }),
        JSON.parse,
      ]),
      TableMappings: pipe([
        get("TableMappings"),
        tap((params) => {
          assert(true);
        }),
        JSON.parse,
      ]),
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DMS.html
exports.DMSReplicationTask = ({ compare }) => ({
  type: "ReplicationTask",
  package: "database-migration-service",
  client: "DatabaseMigrationService",
  propertiesDefault: {},
  omitProperties: [
    "Arn",
    "Status",
    "ReplicationInstanceArn",
    "TargetEndpointArn",
    "SourceEndpointArn",
    "LastFailureMessage",
    "StopReason",
    "ReplicationTaskCreationDate",
    "ReplicationTaskStartDate",
    "ReplicationTaskArn",
    "ReplicationTaskStats",
    "TargetReplicationInstanceArn",
  ],
  inferName: () =>
    pipe([
      get("ReplicationTaskIdentifier"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("ReplicationTaskIdentifier"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("ReplicationTaskIdentifier"),
      tap((id) => {
        assert(id);
      }),
    ]),
  dependencies: {
    replicationInstance: {
      type: "ReplicationInstance",
      group: "DMS",
      dependencyId: ({ lives, config }) =>
        pipe([get("ReplicationInstanceArn")]),
    },
    sourceEndpoint: {
      type: "Endpoint",
      group: "DMS",
      dependencyId: ({ lives, config }) => pipe([get("SourceEndpointArn")]),
    },
    destinationEndpoint: {
      type: "Endpoint",
      group: "DMS",
      dependencyId: ({ lives, config }) => pipe([get("TargetEndpointArn")]),
    },
  },
  ignoreErrorCodes: ["ResourceNotFoundFault"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DMS.html#describeReplicationTasks-property
  getById: {
    method: "describeReplicationTasks",
    getField: "ReplicationTasks",
    pickId: pipe([
      tap(({ ReplicationTaskArn }) => {
        assert(ReplicationTaskArn);
      }),
      ({ ReplicationTaskArn }) => ({
        Filters: [
          {
            Name: "replication-task-arn",
            Values: [ReplicationTaskArn],
          },
        ],
      }),
    ]),
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DMS.html#describeReplicationTasks-property
  getList: {
    method: "describeReplicationTasks",
    getParam: "ReplicationTasks",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DMS.html#createReplicationTask-property
  create: {
    method: "createReplicationTask",
    filterPayload: pipe([
      ReplicationTaskSettingsStringify,
      TableMappingsStringify,
    ]),
    pickCreated: ({ payload }) => pipe([get("ReplicationTask")]),
    isInstanceUp: pipe([eq(get("Status"), "ready")]),
    isInstanceError: pipe([eq(get("Status"), "failed")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DMS.html#modifyReplicationTask-property
  update: {
    method: "modifyReplicationTask",
    filterParams: ({ payload, diff, live }) =>
      pipe([
        () => payload,
        ReplicationTaskSettingsStringify,
        TableMappingsStringify,
        defaultsDeep(pickId(live)),
      ])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DMS.html#deleteReplicationTask-property
  destroy: {
    method: "deleteReplicationTask",
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
    dependencies: { sourceEndpoint, destinationEndpoint, replicationInstance },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        Tags: buildTags({ name, config, namespace, UserTags: Tags }),
        SourceEndpointArn: getField(sourceEndpoint, "EndpointArn"),
        TargetEndpointArn: getField(destinationEndpoint, "EndpointArn"),
        ReplicationInstanceArn: getField(
          replicationInstance,
          "ReplicationInstanceArn"
        ),
      }),
    ])(),
});
