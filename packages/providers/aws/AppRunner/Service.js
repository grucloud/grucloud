const assert = require("assert");
const { eq, pipe, tap, get, pick, assign, tryCatch } = require("rubico");
const {
  defaultsDeep,
  when,
  unless,
  isEmpty,
  callProp,
  first,
  find,
} = require("rubico/x");
const { getField } = require("@grucloud/core/ProviderCommon");
const { getByNameCore } = require("@grucloud/core/Common");
const { buildTags, findNamespaceInTags } = require("../AwsCommon");
const { AwsClient } = require("../AwsClient");
const {
  createAppRunner,
  ignoreErrorCodes,
  tagResource,
  untagResource,
} = require("./AppRunnerCommon");

const findName = get("live.ServiceName");
const findId = get("live.ServiceArn");
const pickId = pick(["ServiceArn"]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ACM.html
exports.AppRunnerService = ({ spec, config }) => {
  const appRunner = createAppRunner(config);
  const client = AwsClient({ spec, config })(appRunner);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppRunner.html#listTagsForResource-property
  const decorate = () =>
    pipe([
      assign({
        Tags: tryCatch(
          pipe([
            ({ ServiceArn }) => ({ ResourceArn: ServiceArn }),
            appRunner().listTagsForResource,
            get("Tags"),
          ]),
          //Error in listing tags for resource: Operation not allowed for resource arn:aws:apprunner:us-east-1:1234567890:service/mock-server/5c5b4af0772e4a82a32738c1d590cc62 when it is in state: deleted
          () => undefined
        ),
      }),
    ]);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppRunner.html#describeService-property
  const getById = client.getById({
    pickId,
    method: "describeService",
    getField: "Service",
    ignoreErrorCodes,
    decorate,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppRunner.html#listServices-property
  const getList = client.getList({
    method: "listServices",
    getParam: "ServiceSummaryList",
    decorate: () => getById,
  });

  const getByName = getByNameCore({ getList, findName });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppRunner.html#createService-property
  const create = client.create({
    method: "createService",
    pickCreated: () => get("Service"),
    shouldRetryOnExceptionMessages: ["Error in assuming access"],
    getById,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppRunner.html#deleteService-property
  const destroy = client.destroy({
    pickId,
    method: "deleteService",
    getById,
    isInstanceDown: eq(get("Status"), "DELETED"),
    ignoreErrorCodes,
  });

  const configDefault = ({
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
              ConnectionArn: getField(dependencies.connection, "ConnectionArn"),
            },
          },
        })
      ),
    ])();

  return {
    type: "Service",
    spec,
    getById,
    findId,
    findNamespace: findNamespaceInTags(config),
    getByName,
    findName,
    create,
    destroy,
    getList,
    configDefault,
    tagResource: tagResource({ appRunner }),
    untagResource: untagResource({ appRunner }),
  };
};
