const assert = require("assert");
const {
  pipe,
  tap,
  get,
  pick,
  map,
  eq,
  omit,
  assign,
  tryCatch,
  and,
  switchCase,
} = require("rubico");
const { defaultsDeep, isIn, when, find, unless } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTags } = require("../AwsCommon");
const { replaceAccountAndRegion } = require("../AwsCommon");

const { Tagger, assignTags } = require("./DocDBCommon");

const buildArn = () =>
  pipe([
    get("DBClusterArn"),
    tap((DBClusterArn) => {
      assert(DBClusterArn);
    }),
  ]);

const pickId = pipe([
  tap(({ DBClusterIdentifier }) => {
    assert(DBClusterIdentifier);
  }),
  pick(["DBClusterIdentifier"]),
]);

const decorate = ({ endpoint, config, lives }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
      assert(lives);
    }),
    assignTags({ buildArn: buildArn(config), endpoint }),
    ({ DBClusterParameterGroup, DBSubnetGroup, ...other }) => ({
      DBClusterParameterGroupName: DBClusterParameterGroup,
      DBSubnetGroupName: DBSubnetGroup,
      ...other,
    }),
    assign({
      VpcSecurityGroupIds: pipe([get("VpcSecurityGroups.VpcSecurityGroupId")]),
      GlobalClusterIdentifier: ({ DBClusterArn }) =>
        pipe([
          tap((params) => {
            assert(DBClusterArn);
          }),
          lives.getByType({
            type: "GlobalCluster",
            group: "DocDB",
          }),
          find(
            pipe([
              get("live.GlobalClusterMembers"),
              find(eq(get("DBClusterArn"), DBClusterArn)),
            ])
          ),
          get("id"),
        ])(),
    }),
    when(
      //
      eq(get("KmsKeyId"), "AWS_OWNED_KMS_KEY"),
      omit(["KmsKeyId"])
    ),
    when(
      get("ReplicationSourceIdentifier"),
      omit(["MasterUserPassword", "MasterUsername"])
    ),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DocDB.html
exports.DocDBDBCluster = ({ compare }) => ({
  type: "DBCluster",
  package: "docdb",
  client: "DocDB",
  propertiesDefault: { BackupRetentionPeriod: 1, Engine: "docdb", Port: 27017 },
  omitProperties: [
    "VpcSecurityGroups",
    "Status",
    "PercentProgress",
    "EarliestRestorableTime",
    "Endpoint",
    "ReaderEndpoint",
    "LatestRestorableTime",
    "ReplicationSourceIdentifier",
    "ReadReplicaIdentifiers",
    "DBClusterMembers",
    "HostedZoneId",
    "DbClusterResourceId",
    "DBClusterArn",
    "AssociatedRoles",
    "CloneGroupId",
    "ClusterCreateTime",
    "MultiAZ",
    "PreSignedUrl",
    "KmsKeyId",
    "AvailabilityZones",
  ],
  compare: compare({
    filterTarget: () =>
      pipe([omit(["MasterUserPassword", "GlobalClusterIdentifier"])]),
  }),
  inferName: () =>
    pipe([
      get("DBClusterIdentifier"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("DBClusterIdentifier"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("DBClusterIdentifier"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["DBClusterNotFoundFault"],
  environmentVariables: [
    {
      path: "MasterUserPassword",
      suffix: "MASTER_USER_PASSWORD",
      rejectEnvironmentVariable: () =>
        pipe([get("ReplicationSourceIdentifier")]),
    },
  ],
  dependencies: {
    // CloudwatchLogs EnabledCloudwatchLogsExports
    kmsKey: {
      type: "Key",
      group: "KMS",
      pathId: "KmsKeyId",
      dependencyId:
        ({ lives, config }) =>
        (live) =>
          pipe([
            () => live,
            get("KmsKeyId"),
            lives.getById({
              type: "Key",
              group: "KMS",
              providerName: config.providerName,
            }),
            // For encrypted cross-region replica, kmsKeyId should be explicitly specified
            switchCase([
              and([
                get("managedByOther"),
                () => !live.ReplicationSourceIdentifier,
              ]),
              () => undefined,
              get("id"),
            ]),
          ])(),
    },
    dbClusterParameterGroup: {
      type: "DBClusterParameterGroup",
      group: "DocDB",
      excludeDefaultDependencies: true,
      dependencyId: ({ lives, config }) => get("DBClusterParameterGroupName"),
    },
    dbSubnetGroup: {
      type: "DBSubnetGroup",
      group: "DocDB",
      dependencyId: ({ lives, config }) => get("DBSubnetGroupName"),
    },
    globalCluster: {
      type: "GlobalCluster",
      group: "DocDB",
      pathId: "GlobalClusterIdentifier",
      optional: true,
      parent: true,
      dependencyId: ({ lives, config }) =>
        pipe([get("GlobalClusterIdentifier")]),
    },
    securityGroups: {
      type: "SecurityGroup",
      group: "EC2",
      list: true,
      pathId: "VpcSecurityGroupIds",
      dependencyIds: ({ lives, config }) => get("VpcSecurityGroupIds"),
    },
  },
  filterLive: ({ lives, providerConfig }) =>
    pipe([
      assign({
        AvailabilityZones: pipe([
          get("AvailabilityZones"),
          map(replaceAccountAndRegion({ lives, providerConfig })),
        ]),
      }),
    ]),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DocDB.html#describeDBClusters-property
  getById: {
    method: "describeDBClusters",
    getField: "DBClusters",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DocDB.html#describeDBClusters-property
  getList: {
    method: "describeDBClusters",
    getParam: "DBClusters",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DocDB.html#createDBCluster-property
  create: {
    // TODO RestoreDBCluster
    method: "createDBCluster",
    pickCreated: ({ payload }) => pipe([() => payload]),
    shouldRetryOnExceptionMessages: [
      "IAM role ARN value is invalid or does not include the required permissions",
      "is in a state which is not valid for physical replication",
      "doesn't have at least one instance in available or creating state",
    ],
    isInstanceUp: pipe([get("Status"), isIn(["available"])]),
    configIsUp: { retryCount: 30 * 10, retryDelay: 5e3 },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DocDB.html#modifyDBCluster-property
  update: {
    method: "modifyDBCluster",
    filterParams: ({ payload, diff, live }) => pipe([() => payload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DocDB.html#deleteDBCluster-property
  destroy: {
    preDestroy: ({ endpoint }) =>
      tap(
        pipe([
          when(
            get("GlobalClusterIdentifier"),
            tryCatch(
              pipe([
                pick(["DbClusterIdentifier", "GlobalClusterIdentifier"]),
                endpoint().removeFromGlobalCluster,
              ]),
              (error) => {
                assert(true);
              }
            )
          ),
        ])
      ),
    method: "deleteDBCluster",
    // TODO  FinalDBSnapshotIdentifier
    pickId: pipe([pickId, defaultsDeep({ SkipFinalSnapshot: true })]),
    shouldRetryOnExceptionMessages: [
      "is not currently in the available state",
      "cluster is a part of a global cluster",
      "Cluster cannot be deleted, it still contains DB instances in non-deleting state",
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
    dependencies: { globalCluster, kmsKey, securityGroups },
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
        () => securityGroups,
        defaultsDeep({
          VpcSecurityGroupIds: pipe([
            () => securityGroups,
            map((sg) => getField(sg, "GroupId")),
          ])(),
        })
      ),
      when(
        () => globalCluster,
        defaultsDeep({
          GlobalClusterIdentifier: getField(
            globalCluster,
            "GlobalClusterIdentifier"
          ),
        })
      ),
    ])(),
});
