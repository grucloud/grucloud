const assert = require("assert");
const { pipe, tap, get, eq, map, pick } = require("rubico");
const { defaultsDeep, when, identity } = require("rubico/x");

const { getField } = require("@grucloud/core/ProviderCommon");

const { getByNameCore } = require("@grucloud/core/Common");

const { Tagger } = require("./EMRServerlessCommon");
const { buildTagsObject } = require("@grucloud/core/Common");

const pickId = pipe([
  pick(["applicationId"]),
  tap(({ applicationId }) => {
    assert(applicationId);
  }),
]);

const buildArn = () => pipe([get("arn")]);

exports.EMRServerlessApplication = ({}) => ({
  type: "Application",
  package: "emr-serverless",
  client: "EMRServerless",
  inferName: () => get("name"),
  findName: () => pipe([get("name")]),
  findId: () => pipe([get("applicationId")]),
  ignoreErrorCodes: ["ResourceNotFoundException"],
  omitProperties: [
    "arn",
    "applicationId",
    "state",
    "stateDetails",
    "createdAt",
    "updatedAt",
  ],
  propertiesDefault: {
    autoStartConfiguration: {
      enabled: true,
    },
    autoStopConfiguration: {
      enabled: true,
      idleTimeoutMinutes: 15,
    },
    initialCapacity: {
      Driver: {
        workerConfiguration: {
          cpu: "4 vCPU",
          disk: "20 GB",
          memory: "16 GB",
        },
        workerCount: 1,
      },
      Executor: {
        workerConfiguration: {
          cpu: "4 vCPU",
          disk: "20 GB",
          memory: "16 GB",
        },
        workerCount: 2,
      },
    },
    maximumCapacity: {
      cpu: "400 vCPU",
      disk: "20000 GB",
      memory: "3000 GB",
    },
  },
  dependencies: {
    securityGroups: {
      type: "SecurityGroup",
      group: "EC2",
      list: true,
      dependencyIds: ({ lives, config }) =>
        get("networkConfiguration.securityGroupIds"),
    },
    subnets: {
      type: "Subnet",
      group: "EC2",
      list: true,
      dependencyIds: ({ lives, config }) =>
        get("networkConfiguration.subnetIds"),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EMRServerless.html#getApplication-property
  getById: {
    method: "getApplication",
    getField: "application",
    pickId,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EMRServerless.html#listApplications-property
  getList: {
    method: "listApplications",
    getParam: "applications",
    decorate: ({ getById }) =>
      pipe([({ id }) => ({ applicationId: id }), getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EMRServerless.html#createApplication-property
  create: {
    method: "createApplication",
    pickCreated: ({ payload }) => pipe([identity]),
    isInstanceUp: pipe([eq(get("state"), "CREATED")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EMRServerless.html#updateApplication-property
  update: {
    method: "updateApplication",
    filterParams: ({ payload, live }) =>
      pipe([
        () => payload,
        defaultsDeep({ applicationId: live.applicationId }),
      ])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EMRServerless.html#deleteApplication-property
  destroy: {
    method: "deleteApplication",
    pickId,
    isInstanceDown: pipe([eq(get("state"), "TERMINATED")]),
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
    dependencies: { subnets, securityGroups },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        tags: buildTagsObject({
          name,
          config,
          namespace,
          userTags: tags,
        }),
      }),
      when(
        () => subnets,
        defaultsDeep({
          networkConfiguration: {
            subnetIds: pipe([
              () => subnets,
              map((subnet) => getField(subnet, "SubnetId")),
            ])(),
          },
        })
      ),
      when(
        () => securityGroups,
        defaultsDeep({
          networkConfiguration: {
            securityGroupIds: pipe([
              () => securityGroups,
              map((sg) => getField(sg, "GroupId")),
            ])(),
          },
        })
      ),
    ])(),
});
