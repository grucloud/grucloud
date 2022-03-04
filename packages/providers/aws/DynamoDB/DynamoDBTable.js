const assert = require("assert");
const { map, pipe, tap, get, eq, not, pick, assign } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { buildTags } = require("../AwsCommon");
const { AwsClient } = require("../AwsClient");
const { createDynamoDB } = require("./DynamoDBCommon");
const findName = get("live.TableName");
const findId = get("live.TableArn");
const pickId = pick(["TableName"]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html
exports.DynamoDBTable = ({ spec, config }) => {
  const dynamoDB = createDynamoDB(config);
  const client = AwsClient({ spec, config })(dynamoDB);

  const findDependencies = ({ live }) => [
    {
      type: "Key",
      group: "KMS",
      ids: [get("SSEDescription.KMSMasterKeyArn")(live)],
    },
  ];

  const findNamespace = pipe([() => ""]);

  const tableArn = ({ TableName, config }) =>
    `arn:aws:dynamodb:${
      config.region
    }:${config.accountId()}:table/${TableName}`;

  const getById = client.getById({
    pickId,
    method: "describeTable",
    getField: "Table",
    ignoreErrorCodes: ["ResourceNotFoundException"],
    decorate: () =>
      pipe([
        tap((params) => {
          assert(params);
        }),
        assign({
          Tags: pipe([
            ({ TableName }) => ({
              ResourceArn: tableArn({ TableName, config }),
            }),
            tap((params) => {
              assert(true);
            }),
            dynamoDB().listTagsOfResource,
            get("Tags"),
          ]),
        }),
      ]),
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html#describeTable-property
  const getByName = ({ name }) => getById({ TableName: name });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html#listTables-property
  const getList = client.getList({
    method: "listTables",
    getParam: "TableNames",
    decorate: () => (TableName) => getById({ TableName }),
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html#createTable-property
  const create = client.create({
    method: "createTable",
    getById,
    pickId,
    isInstanceUp: eq(get("TableStatus"), "ACTIVE"),
    config,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html#updateTable-property
  const update = client.update({
    pickId,
    method: "updateTable",
    config,
    getById,
    isInstanceUp: eq(get("TableStatus"), "ACTIVE"),
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html#deleteTable-property
  const destroy = client.destroy({
    pickId,
    method: "deleteTable",
    getById,
    ignoreErrorCodes: ["ResourceNotFoundException"],
    config,
  });

  const configDefault = ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: {},
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        TableName: name,
        Tags: buildTags({ name, config, namespace, UserTags: Tags }),
      }),
    ])();

  return {
    spec,
    findId,
    findNamespace,
    findDependencies,
    getByName,
    findName,
    create,
    update,
    destroy,
    getList,
    configDefault,
  };
};
