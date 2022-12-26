const assert = require("assert");
const { pipe, tap, get, eq, assign } = require("rubico");
const { defaultsDeep, when, append, identity } = require("rubico/x");
const { buildTagsObject } = require("@grucloud/core/Common");
const { getByNameCore } = require("@grucloud/core/Common");

const { getField } = require("@grucloud/core/ProviderCommon");

const { createAwsResource } = require("../AwsClient");

const { tagResource, untagResource, assignTags } = require("./AppConfigCommon");

const pickId = pipe([
  ({ Id, ApplicationId }) => ({ EnvironmentId: Id, ApplicationId }),
]);

const buildArn = () =>
  pipe([
    get("Arn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const assignArn = ({ config }) =>
  pipe([
    assign({
      Arn: pipe([
        ({ Id, ApplicationId }) =>
          `arn:aws:appconfig:${
            config.region
          }:${config.accountId()}:application/${ApplicationId}/environment/${Id}`,
      ]),
    }),
  ]);

const decorate = ({ endpoint, config }) =>
  pipe([
    assignArn({ config }),
    assignTags({ buildArn: buildArn(config), endpoint }),
  ]);

const model = ({ config }) => ({
  package: "appconfig",
  client: "AppConfig",
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppConfig.html#getEnvironment-property
  getById: {
    method: "getEnvironment",
    pickId,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppConfig.html#createEnvironment-property
  create: {
    method: "createEnvironment",
    pickCreated: ({ payload }) => pipe([identity]),
    isInstanceUp: eq(get("State"), "ReadyForDeployment"),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppConfig.html#updateEnvironment-property
  update: {
    method: "updateEnvironment",
    filterParams: ({ payload, live }) =>
      pipe([() => payload, defaultsDeep({ EnvironmentId: live.Id })])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppConfig.html#deleteEnvironment-property
  destroy: {
    method: "deleteEnvironment",
    pickId,
  },
});

exports.AppConfigEnvironment = ({ spec, config }) =>
  createAwsResource({
    model: model({ config }),
    spec,
    config,
    findName:
      ({ lives, config }) =>
      (live) =>
        pipe([
          () => live,
          get("ApplicationId"),
          lives.getById({
            type: "Application",
            group: "AppConfig",
            providerName: config.providerName,
          }),
          get("name", live.ApplicationId),
          append(`::${live.Name}`),
        ])(),
    findId: () => pipe([get("Id")]),
    getByName: getByNameCore,
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppConfig.html#listEnvironments-property
    getList: ({ client, endpoint, getById, config }) =>
      pipe([
        () =>
          client.getListWithParent({
            parent: { type: "Application", group: "AppConfig" },
            pickKey: pipe([
              tap((params) => {
                assert(true);
              }),
              ({ Id }) => ({ ApplicationId: Id }),
            ]),
            method: "listEnvironments",
            getParam: "Items",
            config,
            decorate,
          }),
      ])(),
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
      dependencies: { application, iamRole },
    }) =>
      pipe([
        () => otherProps,
        defaultsDeep({
          ApplicationId: getField(application, "Id"),
          Tags: buildTagsObject({ name, config, namespace, UserTags: Tags }),
        }),
        when(
          () => iamRole,
          assign({ RetrievalRoleArn: getField(iamRole, "Arn") })
        ),
      ])(),
  });
