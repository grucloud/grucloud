const assert = require("assert");
const {
  map,
  pipe,
  tap,
  tryCatch,
  get,
  filter,
  switchCase,
  fork,
  eq,
} = require("rubico");
const logger = require("@grucloud/core/logger")({
  prefix: "IamPolicyReadOnly",
});
const { tos } = require("@grucloud/core/tos");
const {
  shouldRetryOnException,
  shouldRetryOnExceptionDelete,
} = require("../AwsCommon");
const { getByNameCore } = require("@grucloud/core/Common");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html
exports.AwsIamPolicyReadOnly = ({ spec, config }) => {
  assert(spec);
  assert(config);

  const findName = get("name");
  const findId = get("Arn");
  const findNamespace = get("live.namespace", "");

  const getList = async ({ resources = [] } = {}) =>
    pipe([
      tap(() => {
        logger.info(`getList policy readonly #resources ${resources.length}`);
      }),
      map((resource) => ({
        name: resource.name,
        namespace: resource.namespace,
        ...resource.properties(),
      })),
      tap((items) => {
        logger.info(`getList policy readonly ${tos(items)}`);
      }),
      (items) => ({
        total: items.length,
        items,
      }),
    ])(resources);

  const getByName = ({ name, properties, resources }) =>
    getByNameCore({ name, resources, getList, findName });

  return {
    type: "IamPolicyReadOnly",
    spec,
    getList,
    findName,
    findId,
    findNamespace,
    getByName,
    shouldRetryOnException,
    shouldRetryOnExceptionDelete,
  };
};

exports.isOurMinionIamPolicyReadOnly = () => true;
