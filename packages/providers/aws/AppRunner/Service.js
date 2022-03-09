const assert = require("assert");
const { eq, pipe, tap, get, pick } = require("rubico");
const {
  defaultsDeep,
  when,
  unless,
  isEmpty,
  callProp,
  first,
  find,
  includes,
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

  const findDependencies = ({ live, lives }) => [
    {
      type: "Connection",
      group: "AppRunner",
      ids: [
        pipe([
          tap((params) => {
            assert(true);
          }),
          () => live,
          get("SourceConfiguration.AuthenticationConfiguration.ConnectionArn"),
        ])(),
      ],
    },
    {
      type: "Repository",
      group: "ECR",
      ids: [
        pipe([
          () => live,
          get("SourceConfiguration.ImageRepository.ImageIdentifier"),
          unless(
            isEmpty,
            pipe([
              callProp("split", ":"),
              first,
              (repositoryUri) =>
                pipe([
                  () =>
                    lives.getByType({
                      type: "Repository",
                      group: "ECR",
                      providerName: config.providerName,
                    }),
                  find(eq(get("live.repositoryUri"), repositoryUri)),
                ])(),
              get("id"),
            ])
          ),
        ])(),
      ],
    },
    {
      type: "Role",
      group: "IAM",
      ids: [
        pipe([
          () => live,
          get("SourceConfiguration.AuthenticationConfiguration.AccessRoleArn"),
        ])(),
      ],
    },
  ];

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppRunner.html#describeService-property
  const getById = client.getById({
    pickId,
    method: "describeService",
    getField: "Service",
    ignoreErrorCodes,
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
    findDependencies,
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
