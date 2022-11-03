const assert = require("assert");
const { eq, pipe, tap, get, pick, assign, tryCatch } = require("rubico");
const { defaultsDeep, when } = require("rubico/x");
const { getField } = require("@grucloud/core/ProviderCommon");
const { getByNameCore } = require("@grucloud/core/Common");
const { buildTags } = require("../AwsCommon");
const { createAwsResource } = require("../AwsClient");
const { tagResource, untagResource, assignTags } = require("./AppRunnerCommon");

const buildArn = () => get("ServiceArn");
const pickId = pipe([pick(["ServiceArn"])]);

const decorate = ({ endpoint }) =>
  pipe([assignTags({ endpoint, buildArn: buildArn() })]);

const model = ({ config }) => ({
  package: "apprunner",
  client: "AppRunner",
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppRunner.html#describeService-property
  getById: {
    method: "describeService",
    pickId,
    getField: "Service",
    decorate,
  },
  getList: {
    method: "listServices",
    getParam: "ServiceSummaryList",
    decorate: ({ getById, endpoint }) => pipe([getById]),
  },
  create: {
    method: "createService",
    pickCreated: ({ payload }) => pipe([get("Service")]),
    shouldRetryOnExceptionMessages: ["Error in assuming access"],
    isInstanceUp: pipe([eq(get("Status"), "RUNNING")]),
    isInstanceError: pipe([eq(get("Status"), "CREATE_FAILED")]),
  },
  update: {
    method: "updateService",
    filterParams: ({ payload, live }) =>
      pipe([() => payload, defaultsDeep({ ServiceArn: live.ServiceArn })])(),
  },
  destroy: {
    method: "deleteService",
    pickId,
    isInstanceDown: eq(get("Status"), "DELETED"),
  },
});

exports.AppRunnerService = ({ spec, config }) =>
  createAwsResource({
    model: model({ config }),
    spec,
    config,
    findName: pipe([get("live.ServiceName")]),
    findId: pipe([get("live.ServiceArn")]),
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
      dependencies,
    }) =>
      pipe([
        () => otherProps,
        defaultsDeep({
          ServiceName: name,
          Tags: buildTags({ name, namespace, config, UserTags: Tags }),
        }),
        when(
          () => dependencies.vpcConnector,
          defaultsDeep({
            NetworkConfiguration: {
              EgressConfiguration: {
                VpcConnectorArn: getField(
                  dependencies.vpcConnector,
                  "VpcConnectorArn"
                ),
              },
            },
          })
        ),
        when(
          () => dependencies.kmsKey,
          defaultsDeep({
            EncryptionConfiguration: {
              KmsKey: getField(dependencies.kmsKey, "Arn"),
            },
          })
        ),
        when(
          () => dependencies.accessRole,
          defaultsDeep({
            SourceConfiguration: {
              AuthenticationConfiguration: {
                AccessRoleArn: getField(dependencies.accessRole, "Arn"),
              },
            },
          })
        ),
        when(
          () => dependencies.connection,
          defaultsDeep({
            SourceConfiguration: {
              AuthenticationConfiguration: {
                ConnectionArn: getField(
                  dependencies.connection,
                  "ConnectionArn"
                ),
              },
            },
          })
        ),
      ])(),
  });
