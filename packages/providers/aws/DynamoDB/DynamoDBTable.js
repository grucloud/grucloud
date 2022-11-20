const assert = require("assert");
const { map, pipe, tap, get, eq, pick, assign } = require("rubico");
const { defaultsDeep, when } = require("rubico/x");

const { buildTags } = require("../AwsCommon");
const { AwsClient } = require("../AwsClient");
const {
  createDynamoDB,
  ignoreErrorCodes,
  tagResource,
  untagResource,
} = require("./DynamoDBCommon");
const { getField } = require("@grucloud/core/ProviderCommon");
const findName = () => get("TableName");
const findId = () => get("TableArn");
const pickId = pick(["TableName"]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html
exports.DynamoDBTable = ({ spec, config }) => {
  const dynamoDB = createDynamoDB(config);
  const client = AwsClient({ spec, config })(dynamoDB);

  const tableArn = ({ TableName, config }) =>
    `arn:aws:dynamodb:${
      config.region
    }:${config.accountId()}:table/${TableName}`;

  const decorate = () =>
    pipe([
      assign({
        Tags: pipe([
          ({ TableName }) => ({
            ResourceArn: tableArn({ TableName, config }),
          }),
          dynamoDB().listTagsOfResource,
          get("Tags"),
        ]),
      }),
    ]);

  const getById = client.getById({
    pickId,
    method: "describeTable",
    getField: "Table",
    ignoreErrorCodes,
    decorate,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html#describeTable-property
  const getByName = pipe([({ name }) => ({ TableName: name }), getById({})]);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html#listTables-property
  const getList = client.getList({
    method: "listTables",
    getParam: "TableNames",
    decorate: () => pipe([(TableName) => ({ TableName }), getById({})]),
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html#createTable-property
  const create = client.create({
    method: "createTable",
    pickCreated:
      ({ payload }) =>
      () =>
        payload,
    getById,
    isInstanceUp: eq(get("TableStatus"), "ACTIVE"),
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html#updateTable-property
  const update = client.update({
    pickId,
    method: "updateTable",
    getById,
    isInstanceUp: eq(get("TableStatus"), "ACTIVE"),
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html#deleteTable-property
  const destroy = client.destroy({
    pickId,
    method: "deleteTable",
    getById,
    ignoreErrorCodes,
  });

  const configDefault = ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { kmsKey },
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        Tags: buildTags({ name, config, namespace, UserTags: Tags }),
      }),
      when(
        () => kmsKey,
        defaultsDeep({
          SSEDescription: { KMSMasterKeyId: getField(kmsKey, "Arn") },
        })
      ),
    ])();

  return {
    spec,
    findId,
    getByName,
    getById,
    findName,
    create,
    update,
    destroy,
    getList,
    configDefault,
    tagResource: tagResource({ dynamoDB }),
    untagResource: untagResource({ dynamoDB }),
  };
};
