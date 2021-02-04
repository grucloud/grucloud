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
const logger = require("../../../logger")({ prefix: "IamPolicyReadOnly" });
const { tos } = require("../../../tos");
const {
  shouldRetryOnException,
  shouldRetryOnExceptionDelete,
} = require("../AwsCommon");
const { getByNameCore } = require("../../Common");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html
exports.AwsIamPolicyReadOnly = ({ spec, config }) => {
  assert(spec);
  assert(config);

  const findName = get("Arn");
  const findId = findName;

  const getList = async ({ resources = [] } = {}) =>
    pipe([
      tap(() => {
        logger.info(`getList policy readonly #resources ${resources.length}`);
      }),
      map((resource) => ({ Arn: resource.name })),
      tap((items) => {
        logger.info(`getList policy readonly ${tos(items)}`);
      }),
      (items) => ({
        total: items.length,
        items,
      }),
    ])(resources);

  const getByName = ({ name, resources }) =>
    getByNameCore({ name, resources, getList, findName });

  return {
    type: "IamPolicyReadOnly",
    spec,
    getList,
    findName,
    findId,
    getByName,
    shouldRetryOnException,
    shouldRetryOnExceptionDelete,
  };
};
