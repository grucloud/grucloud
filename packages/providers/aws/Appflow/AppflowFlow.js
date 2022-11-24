const assert = require("assert");
const { pipe, tap, get, pick, eq, map } = require("rubico");
const { defaultsDeep, when, identity, pluck } = require("rubico/x");

const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTagsObject } = require("@grucloud/core/Common");

const { Tagger } = require("./AppflowCommon");
const { omitIfEmpty } = require("@grucloud/core/Common");

const buildArn = () =>
  pipe([
    get("flowArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ flowName }) => {
    assert(flowName);
  }),
  pick(["flowName"]),
]);

const decorate = ({ endpoint }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    omitIfEmpty([
      "metadataCatalogConfig",
      "triggerConfig.triggerProperties.Scheduled",
      "triggerConfig.triggerProperties",
    ]),
    tap((params) => {
      assert(true);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Appflow.html
exports.AppflowFlow = () => ({
  type: "Flow",
  package: "appflow",
  client: "Appflow",
  propertiesDefault: {},
  omitProperties: [
    "createdAt",
    "createdBy",
    "flowArn",
    "flowStatus",
    "lastRunExecutionDetails",
    "lastUpdatedAt",
    "lastUpdatedBy",
    "kmsArn",
  ],
  inferName: () =>
    pipe([
      get("flowName"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("flowName"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("flowArn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  dependencies: {
    connectorProfileSource: {
      type: "ConnectorProfile",
      group: "Appflow",
      dependencyId: ({ lives, config }) =>
        pipe([get("sourceFlowConfig.connectorProfileName")]),
    },
    connectorProfileDestinations: {
      type: "ConnectorProfile",
      group: "Appflow",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([get("destinationFlowConfigList"), pluck("connectorProfileName")]),
    },
    eventBusDestinations: {
      type: "EventBus",
      group: "CloudWatchEvents",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([
          get("destinationFlowConfigList"),
          pluck("destinationConnectorProperties.EventBridge.TODO"), //TODO
          tap((params) => {
            assert(true);
          }),
        ]),
      dependencyId: ({ lives, config }) =>
        pipe([get("destination_flow_config.eventBus")]), // TODO
    },
    kmsKey: {
      type: "Key",
      group: "KMS",
      excludeDefaultDependencies: true,
      dependencyId: ({ lives, config }) => get("kmsArn"),
    },
    redshiftClusterDestinations: {
      type: "Cluster",
      group: "Redshift",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([
          get("destinationFlowConfigList"),
          pluck("destinationConnectorProperties.Redshift.TODO"), //TODO
          tap((params) => {
            assert(true);
          }),
        ]),
    },
    s3BucketSource: {
      type: "Bucket",
      group: "S3",
      dependencyId: ({ lives, config }) =>
        pipe([
          get("sourceFlowConfig.sourceConnectorProperties.S3.bucketName"),
          lives.getByName({
            type: "Bucket",
            group: "S3",
            providerName: config.providerName,
          }),
          get("id"),
        ]),
    },
    s3BucketDestinations: {
      type: "Bucket",
      group: "S3",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([
          get("destinationFlowConfigList"),
          pluck("destinationConnectorProperties.S3.bucketName"),
          map(
            pipe([
              lives.getByName({
                type: "Bucket",
                group: "S3",
                providerName: config.providerName,
              }),
              get("id"),
            ])
          ),
          tap((params) => {
            assert(true);
          }),
        ]),
    },
  },
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Appflow.html#getFlow-property
  getById: {
    method: "describeFlow",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Appflow.html#listFlows-property
  getList: {
    method: "listFlows",
    getParam: "flows",
    decorate: ({ getById }) =>
      pipe([
        tap((params) => {
          assert(true);
        }),
        getById,
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Appflow.html#createFlow-property
  create: {
    method: "createFlow",
    pickCreated: ({ payload }) => pipe([() => payload]),
    isInstanceUp: pipe([eq(get("flowStatus"), "Active")]),
    isInstanceError: pipe([eq(get("flowStatus"), "Errored")]),
    getErrorMessage: get("flowStatusMessage", "error"),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Appflow.html#updateFlow-property
  update: {
    method: "updateFlow",
    filterParams: ({ pickId, payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Appflow.html#deleteFlow-property
  destroy: {
    method: "deleteFlow",
    pickId: pipe([pickId, defaultsDeep({ forceDelete: true })]),
  },
  getByName: ({ getById }) =>
    pipe([({ name }) => ({ flowName: name }), getById({})]),
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  configDefault: ({
    name,
    namespace,
    properties: { tags, ...otherProps },
    dependencies: { eventBus, kmsKey, redshiftCluster },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        tags: buildTagsObject({ name, config, namespace, userTags: tags }),
      }),
      //TODO
      //   when(
      //     () => eventBus,
      //     defaultsDeep({
      //         eventBus: getField(eventBus, "Arn"),
      //     })
      //   ),
      when(
        () => kmsKey,
        defaultsDeep({
          kmsArn: getField(kmsKey, "Arn"),
        })
      ),
      // TODO
      //   when(
      //     () => redshiftCluster,
      //     defaultsDeep({
      //       kmsKeyId: getField(redshiftCluster, "Arn"),
      //     })
      //   ),
    ])(),
});
