const assert = require("assert");
const { pipe, tap, get, eq, map, pick } = require("rubico");
const { defaultsDeep, when, identity } = require("rubico/x");

const { getField } = require("@grucloud/core/ProviderCommon");

const { getByNameCore } = require("@grucloud/core/Common");

const { createAwsResource } = require("../AwsClient");
const { tagResource, untagResource } = require("./EMRServerlessCommon");
const { buildTagsObject } = require("@grucloud/core/Common");

const pickId = pipe([
  pick(["applicationId"]),
  tap(({ applicationId }) => {
    assert(applicationId);
  }),
]);

const model = ({ config }) => ({
  package: "emr-serverless",
  client: "EMRServerless",
  ignoreErrorCodes: ["ResourceNotFoundException"],
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
});

const buildArn = () => pipe([get("arn")]);

exports.EMRServerlessApplication = ({ spec, config }) =>
  createAwsResource({
    model: model({ config }),
    spec,
    config,
    findName: pipe([get("live.name")]),
    findId: pipe([get("live.applicationId")]),
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
      properties: { tags, ...otherProps },
      dependencies: { subnets, securityGroups },
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
