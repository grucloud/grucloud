const assert = require("assert");
const { pipe, map, tap, get, pick, assign, flatMap } = require("rubico");
const { defaultsDeep, when, callProp } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");
const { omitIfEmpty } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTags } = require("../AwsCommon");

const { createAwsResource } = require("../AwsClient");
const { tagResource, untagResource } = require("./CodeDeployCommon");

const pickId = pipe([
  tap((params) => {
    assert(true);
  }),
  tap(({ applicationName, deploymentGroupName }) => {
    assert(applicationName);
    assert(deploymentGroupName);
  }),
  pick(["applicationName", "deploymentGroupName"]),
]);

const omitDeploymentGroupProperties = omitIfEmpty([
  "ec2TagFilters",
  "autoScalingGroups",
  "onPremisesInstanceTagFilters",
]);

const sortAutoRollbackConfigurationEvents = assign({
  autoRollbackConfiguration: pipe([
    get("autoRollbackConfiguration"),
    assign({
      events: pipe([
        get("events"),
        callProp("sort", (a, b) => a.localeCompare(b)),
      ]),
    }),
  ]),
});

const buildArn =
  ({ config }) =>
  ({ applicationName, deploymentGroupName }) =>
    `arn:aws:codedeploy:${
      config.region
    }:${config.accountId()}:deploymentgroup:${applicationName}/${deploymentGroupName}`;

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodeDeploy.html#listTagsForResource-property
const assignTags = ({ endpoint, config }) =>
  pipe([
    assign({
      tags: pipe([
        buildArn({ config }),
        (ResourceArn) => ({ ResourceArn }),
        endpoint().listTagsForResource,
        get("Tags"),
      ]),
    }),
  ]);

const model = ({ config }) => ({
  package: "codedeploy",
  client: "CodeDeploy",
  ignoreErrorCodes: [
    "ApplicationDoesNotExistException",
    "DeploymentGroupDoesNotExistException",
  ],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodeDeploy.html#getDeploymentGroup-property
  getById: {
    method: "getDeploymentGroup",
    pickId,
    getField: "deploymentGroupInfo",
    decorate: ({ endpoint }) =>
      pipe([
        assignTags({ endpoint, config }),
        sortAutoRollbackConfigurationEvents,
        omitDeploymentGroupProperties,
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodeDeploy.html#createDeploymentGroup-property
  create: {
    method: "createDeploymentGroup",
    pickCreated:
      ({ payload }) =>
      () =>
        payload,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodeDeploy.html#updateDeploymentGroup-property
  update: {
    method: "updateDeploymentGroup",
    filterParams: ({ payload, live }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodeDeploy.html#deleteDeploymentGroup-property
  destroy: {
    method: "deleteDeploymentGroup",
    pickId,
  },
});

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodeDeploy.html
exports.CodeDeployDeploymentGroup = ({ spec, config }) =>
  createAwsResource({
    model: model({ config }),
    spec,
    config,
    findName: pipe([
      get("live"),
      ({ applicationName, deploymentGroupName }) =>
        `${applicationName}::${deploymentGroupName}`,
    ]),
    findId: pipe([get("live.deploymentGroupId")]),
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodeDeploy.html#listDeploymentGroups-property
    getList: ({ client, endpoint, getById, config }) =>
      pipe([
        () =>
          client.getListWithParent({
            parent: { type: "Application", group: "CodeDeploy" },
            pickKey: pipe([pick(["applicationName"])]),
            method: "listDeploymentGroups",
            getParam: "deploymentGroups",
            decorate: ({ lives, parent }) =>
              pipe([
                (deploymentGroupName) => ({
                  applicationName: parent.applicationName,
                  deploymentGroupName,
                }),
                getById,
              ]),
            config,
          }),
      ])(),
    getByName: getByNameCore,
    tagResource: tagResource({ buildArn: buildArn({ config }) }),
    untagResource: untagResource({ buildArn: buildArn({ config }) }),
    configDefault: ({
      name,
      namespace,
      properties: { tags, ...otherProps },
      //TODO add other dependencies
      dependencies: { serviceRole, autoScalingGroups },
    }) =>
      pipe([
        () => otherProps,
        defaultsDeep({
          serviceRoleArn: getField(serviceRole, "Arn"),
          tags: buildTags({
            name,
            config,
            namespace,
            UserTags: tags,
          }),
        }),
        when(
          () => autoScalingGroups,
          defaultsDeep({
            autoScalingGroups: pipe([
              () => autoScalingGroups,
              // TODO AutoScalingGroupName or AutoScalingGroupARN ?
              map((autoScalingGroup) =>
                getField(autoScalingGroup, "AutoScalingGroupName")
              ),
            ]),
          })
        ),
      ])(),
  });
