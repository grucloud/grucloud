const assert = require("assert");
const { pipe, tap, get, pick, eq } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { AwsClient } = require("../AwsClient");
const { createCloudFormation } = require("./CloudFormationCommon");

const ignoreErrorCodes = ["NoSuchCloudFormationOriginAccessIdentity"];
const ignoreErrorMessages = ["does not exist"];

const findName = pipe([get("live.StackName")]);
const findId = get("live.StackId");

const pickId = pipe([
  tap(({ StackName }) => {
    assert(StackName);
  }),
  pick(["StackName"]),
]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFormation.html
exports.CloudFormationStack = ({ spec, config }) => {
  const cloudFormation = createCloudFormation(config);
  const client = AwsClient({ spec, config })(cloudFormation);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFormation.html#describeStacks-property
  const getById = client.getById({
    pickId,
    method: "describeStacks",
    getField: "Stacks",
    ignoreErrorCodes,
    ignoreErrorMessages,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFormation.html#describeStacks-property
  const getList = client.getList({
    method: "describeStacks",
    getParam: "Stacks",
  });

  const getByName = pipe([({ name }) => ({ StackName: name }), getById]);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFormation.html#createStack-property
  const configDefault = ({ name, properties, dependencies: {} }) =>
    pipe([() => properties, defaultsDeep({ StackName: name })])();

  const create = client.create({
    method: "createStack",
    getById,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFormation.html#deleteStack-property
  const destroy = client.destroy({
    pickId,
    method: "deleteStack",
    getById,
    ignoreErrorCodes,
    ignoreErrorMessages,
    isInstanceError: pipe([eq(get("StackStatus"), "DELETE_FAILED")]),
  });

  return {
    spec,
    findId,
    getByName,
    getById,
    findName,
    create,
    destroy,
    getList,
    configDefault,
  };
};
