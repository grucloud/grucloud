const assert = require("assert");
const { pipe, tap, get, pick, eq, map, assign, or } = require("rubico");
const { defaultsDeep, when, first } = require("rubico/x");

const { getField } = require("@grucloud/core/ProviderCommon");

const { buildTags } = require("../AwsCommon");
const { createAwsResource } = require("../AwsClient");

const { tagResource, untagResource, assignTags } = require("./MemoryDBCommon");

const pickId = pipe([({ Name }) => ({ ClusterName: Name })]);

const model = ({ config }) => ({
  package: "memorydb",
  client: "MemoryDB",
  ignoreErrorCodes: ["ClusterNotFoundFault"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MemoryDB.html#describeClusters-property
  getById: {
    method: "describeClusters",
    getField: "Clusters",
    pickId,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MemoryDB.html#describeClusters-property
  getList: {
    method: "describeClusters",
    getParam: "Clusters",
    decorate: assignTags,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MemoryDB.html#createCluster-property
  create: {
    method: "createCluster",
    filterPayload: pipe([
      ({ Name, ...other }) => ({
        ClusterName: Name,
        ...other,
      }),
    ]),
    pickCreated: ({ payload }) => pipe([get("Cluster")]),
    isInstanceUp: pipe([eq(get("Status"), "Available")]),
    configIsUp: { retryCount: 60 * 10, retryDelay: 5e3 },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MemoryDB.html#deleteCluster-property
  destroy: {
    method: "deleteCluster",
    pickId,
  },
});

const buildArn = () => pipe([get("ARN")]);

exports.MemoryDBCluster = ({ spec, config }) =>
  createAwsResource({
    model: model({ config }),
    spec,
    config,
    findName: pipe([get("live.Name")]),
    findId: pipe([get("live.ARN")]),
    getByName: ({ getList, endpoint, getById }) =>
      pipe([
        ({ name }) => ({
          Name: name,
        }),
        getById,
      ]),
    tagResource: tagResource({
      buildArn: buildArn(config),
    }),
    untagResource: untagResource({
      buildArn: buildArn(config),
    }),
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MemoryDB.html#modifyCluster-property
    update:
      ({ endpoint }) =>
      async ({ pickId, payload, diff, live }) =>
        pipe([
          tap((params) => {
            assert(endpoint);
          }),
          () => diff,
        ])(),
    configDefault: ({
      name,
      namespace,
      properties: { Tags, ...otherProps },
      dependencies: {
        acl,
        kmsKey,
        parameterGroup,
        subnetGroup,
        securityGroups,
      },
    }) =>
      pipe([
        () => otherProps,
        defaultsDeep({
          Tags: buildTags({
            name,
            config,
            namespace,
            userTags: Tags,
          }),
        }),
        when(
          () => acl,
          assign({
            ACLName: () => acl.config.Name,
          })
        ),
        when(
          () => parameterGroup,
          assign({
            ParameterGroupName: () => parameterGroup.config.Name,
          })
        ),
        when(
          () => subnetGroup,
          assign({
            SubnetGroupName: () => subnetGroup.config.Name,
          })
        ),
        when(() => kmsKey, defaultsDeep({ KmsKeyId: getField(kmsKey, "Arn") })),
        when(
          () => securityGroups,
          assign({
            SecurityGroupIds: pipe([
              () => securityGroups,
              map((sg) => getField(sg, "GroupId")),
            ]),
          })
        ),
        tap((params) => {
          assert(true);
        }),
      ])(),
  });
