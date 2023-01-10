const assert = require("assert");
const { pipe, tap, get, assign, map } = require("rubico");
const { defaultsDeep, when } = require("rubico/x");
const { getField } = require("@grucloud/core/ProviderCommon");

const { getByNameCore, omitIfEmpty } = require("@grucloud/core/Common");
const { buildTagsObject } = require("@grucloud/core/Common");

const { Tagger } = require("./ImagebuilderCommon");

const buildArn = () =>
  pipe([
    get("arn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ arn }) => {
    assert(arn);
  }),
  ({ arn }) => ({ infrastructureConfigurationArn: arn }),
]);

const decorate =
  ({ endpoint, config }) =>
  (live) =>
    pipe([
      tap((params) => {
        assert(endpoint);
      }),
      () => live,
      JSON.stringify,
      JSON.parse,
      omitIfEmpty(["instanceMetadataOptions", "logging.s3Logs", "logging"]),
    ])();

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Imagebuilder.html
exports.ImagebuilderInfrastructureConfiguration = () => ({
  type: "InfrastructureConfiguration",
  package: "imagebuilder",
  client: "Imagebuilder",
  propertiesDefault: { terminateInstanceOnFailure: true },
  inferName: () =>
    pipe([
      get("name"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("name"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("arn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  omitProperties: [
    "arn",
    "dateCreated",
    "dateUpdated",
    "securityGroupIds",
    "subnetId",
    "instanceProfileName",
  ],
  dependencies: {
    instanceProfile: {
      type: "InstanceProfile",
      group: "IAM",
      dependencyId: ({ lives, config }) =>
        pipe([
          get("instanceProfileName"),
          lives.getByName({
            type: "InstanceProfile",
            group: "IAM",
            providerName: config.providerName,
          }),
          get("id"),
        ]),
    },
    keyPair: {
      type: "KeyPair",
      group: "EC2",
      dependencyId: ({ lives, config }) =>
        pipe([
          get("keyPair"),
          lives.getByName({
            type: "KeyPair",
            group: "EC2",
            providerName: config.providerName,
          }),
          get("id"),
        ]),
    },
    securityGroups: {
      type: "SecurityGroup",
      group: "EC2",
      list: true,
      dependencyIds: ({ lives, config }) => get("securityGroupIds"),
    },
    subnet: {
      type: "Subnet",
      group: "EC2",
      dependencyId: ({ lives, config }) => get("subnetId"),
    },
    snsTopic: {
      type: "Topic",
      group: "SNS",
      dependencyId: ({ lives, config }) => pipe([get("snsTopicArn")]),
    },
    s3Bucket: {
      type: "Bucket",
      group: "S3",
      dependencyId: ({ lives, config }) => get("logging.s3Logs.s3BucketName"),
    },
  },
  ignoreErrorCodes: ["ResourceNotFoundException"],
  filterLive: ({ lives, providerConfig }) => pipe([assign({})]),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Imagebuilder.html#getInfrastructureConfiguration-property
  getById: {
    method: "getInfrastructureConfiguration",
    getField: "infrastructureConfiguration",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Imagebuilder.html#listInfrastructureConfigurations-property
  getList: {
    method: "listInfrastructureConfigurations",
    getParam: "infrastructureConfigurationSummaryList",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Imagebuilder.html#createInfrastructureConfiguration-property
  create: {
    method: "createInfrastructureConfiguration",
    pickCreated: ({ payload }) =>
      pipe([
        ({ infrastructureConfigurationArn }) => ({
          arn: infrastructureConfigurationArn,
        }),
      ]),
    // The value supplied for parameter 'instanceProfileName'
    shouldRetryOnExceptionMessages: [
      "The value supplied for parameter 'instanceProfileName'",
    ],
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Imagebuilder.html#updateInfrastructureConfiguration-property
  update: {
    method: "updateInfrastructureConfiguration",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Imagebuilder.html#deleteInfrastructureConfiguration-property
  destroy: {
    method: "deleteInfrastructureConfiguration",
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
    dependencies: { instanceProfile, securityGroups, subnet, snsTopic },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        tags: buildTagsObject({ name, config, namespace, userTags: tags }),
      }),
      when(
        () => instanceProfile,
        defaultsDeep({
          instanceProfileName: instanceProfile.resource.name,
        })
      ),
      when(
        () => securityGroups,
        defaultsDeep({
          securityGroupIds: pipe([
            () => securityGroups,
            map((sg) => getField(sg, "GroupId")),
          ])(),
        })
      ),
      when(
        () => subnet,
        defaultsDeep({
          subnetId: getField(subnet, "SubnetId"),
        })
      ),
      when(
        () => snsTopic,
        defaultsDeep({
          snsTopic: getField(snsTopic, "Attributes.TopicArn"),
        })
      ),
    ])(),
});
