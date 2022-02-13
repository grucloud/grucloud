const assert = require("assert");
const { map, pipe, tap, get, pick } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const logger = require("@grucloud/core/logger")({
  prefix: "AppRunner",
});
const { getByNameCore } = require("@grucloud/core/Common");
const {
  buildTags,
  findNamespaceInTags,
  shouldRetryOnException,
} = require("../AwsCommon");
const { AwsClient } = require("../AwsClient");

const findName = get("live.DomainName");
const findId = get("live.ServiceArn");
const pickId = pick(["ServiceArn"]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ACM.html
exports.AppRunnerService = ({ spec, config }) => {
  const client = AwsClient({ spec, config });

  const findDependencies = ({ live, lives }) => [];

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppRunner.html#describeService-property
  const getById = client.getById({
    pickId,
    method: "describeService",
    ignoreErrorCodes: ["NotFoundException"],
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppRunner.html#listServices-property
  const getList = client.getList({
    method: "listServices",
    getParam: "ServiceSummaryList",
  });

  const getByName = getByNameCore({ getList, findName });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppRunner.html#createService-property
  const create = client.create({
    method: "createService",
    //isInstanceUp,
    //filterPayload: omit(["DnsHostnames", "DnsSupport"]),
    pickCreated: (payload) => (result) =>
      pipe([
        tap((params) => {
          assert(payload);
        }),
        () => result,
        pickId,
      ])(),
    pickId,
    getById,
    config,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppRunner.html#deleteService-property
  const destroy = client.destroy({
    pickId,
    method: "deleteService",
    getById,
    ignoreErrorCodes: ["InvalidVpcID.NotFound"],
    config,
  });

  const configDefault = ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies,
  }) =>
    defaultsDeep({
      DomainName: name,
      Tags: buildTags({ name, namespace, config, UserTags: Tags }),
    })(otherProps);

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
    shouldRetryOnException,
    cannotBeDeleted: () => true,
  };
};
