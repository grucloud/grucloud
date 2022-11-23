const assert = require("assert");
const { pipe, tap, get, eq, pick, map, assign } = require("rubico");
const { defaultsDeep, identity, when } = require("rubico/x");
const { buildTagsObject } = require("@grucloud/core/Common");

const { getByNameCore } = require("@grucloud/core/Common");

const { createAwsResource } = require("../AwsClient");

const { tagResource, untagResource } = require("./MQCommon");
const { getField } = require("@grucloud/core/ProviderCommon");

const buildArn = () => get("BrokerArn");

const pickId = pipe([
  tap((params) => {
    assert(true);
  }),
  pick(["BrokerId"]),
]);

const model = ({ config }) => ({
  package: "mq",
  client: "Mq",
  ignoreErrorCodes: ["NotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MQ.html#describeBroker-property
  getById: {
    method: "describeBroker",
    pickId,
    decorate:
      ({ endpoint }) =>
      (live) =>
        pipe([
          () => live,
          ({ Configurations: { Current }, ...other }) => ({
            Configuration: Current,
            ...other,
          }),
          assign({
            Users: pipe([
              () => live,
              pick(["BrokerId"]),
              endpoint().listUsers,
              get("Users"),
            ]),
          }),
        ])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MQ.html#listBrokers-property
  getList: {
    method: "listBrokers",
    getParam: "BrokerSummaries",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MQ.html#createBroker-property
  create: {
    method: "createBroker",
    pickCreated: ({ payload }) => identity,
    isInstanceUp: eq(get("BrokerState"), "RUNNING"),
    isInstanceError: eq(get("BrokerState"), "CREATION_FAILED"),
    configIsUp: { retryCount: 50 * 12, retryDelay: 5e3 },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MQ.html#updateBroker-property
  update: {
    method: "updateBroker",
    filterParams: ({ payload, live }) =>
      pipe([() => payload, defaultsDeep({ BrokerId: live.BrokerId })])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MQ.html#deleteBroker-property
  destroy: {
    method: "deleteBroker",
    pickId,
  },
});

exports.MQBroker = ({ spec, config }) =>
  createAwsResource({
    model: model({ config }),
    spec,
    config,
    findName: () => pipe([get("BrokerName")]),
    findId: () => pipe([get("BrokerId")]),
    getByName: getByNameCore,
    tagResource: tagResource({
      buildArn: buildArn(config),
    }),
    untagResource: untagResource({
      buildArn: buildArn(config),
    }),
    configDefault: ({
      name,
      namespace,
      properties: { Tags, ...otherProps },
      dependencies: {
        configuration,
        //TODO
        logGroupAudit,
        logGroupGeneral,
        subnets,
        securityGroups,
      },
    }) =>
      pipe([
        () => otherProps,
        defaultsDeep({
          Tags: buildTagsObject({ name, config, namespace, userTags: Tags }),
        }),
        when(
          () => configuration,
          defaultsDeep({
            Configuration: { Id: getField(configuration, "Id") },
          })
        ),
        when(
          () => subnets,
          defaultsDeep({
            SubnetIds: pipe([
              () => subnets,
              map((subnet) => getField(subnet, "SubnetId")),
            ])(),
          })
        ),
        when(
          () => securityGroups,
          defaultsDeep({
            SecurityGroups: pipe([
              () => securityGroups,
              map((sg) => getField(sg, "GroupId")),
            ])(),
          })
        ),
      ])(),
  });
