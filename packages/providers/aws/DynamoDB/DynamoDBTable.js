const assert = require("assert");
const {
  map,
  pipe,
  tap,
  tryCatch,
  get,
  switchCase,
  eq,
  not,
  pick,
  assign,
} = require("rubico");
const { defaultsDeep, isEmpty } = require("rubico/x");

const logger = require("@grucloud/core/logger")({ prefix: "DynamoDBTable" });
const { tos } = require("@grucloud/core/tos");
const { retryCall } = require("@grucloud/core/Retry");
const {
  createEndpoint,
  shouldRetryOnException,
  buildTags,
} = require("../AwsCommon");

const findName = get("live.TableName");
const findId = get("live.TableArn");
const pickParam = pick(["TableName"]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html
exports.DynamoDBTable = ({ spec, config }) => {
  const dynamoDB = () => createEndpoint({ endpointName: "DynamoDB" })(config);

  const findDependencies = ({ live }) => [
    {
      type: "Key",
      group: "kms",
      ids: [get("SSEDescription.KMSMasterKeyArn")(live)],
    },
  ];

  const findNamespace = pipe([
    tap((params) => {
      assert(true);
    }),
    () => "",
  ]);

  const tableArn = ({ TableName, config }) =>
    `arn:aws:dynamodb:${
      config.region
    }:${config.accountId()}:table/${TableName}`;

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html#describeTable-property
  const getByName = ({ name: TableName }) =>
    tryCatch(
      pipe([
        tap(() => {
          assert(TableName);
        }),
        () => ({ TableName }),
        dynamoDB().describeTable,
        get("Table"),
        assign({
          Tags: pipe([
            () => ({ ResourceArn: tableArn({ TableName, config }) }),
            tap((params) => {
              assert(true);
            }),
            dynamoDB().listTagsOfResource,
            get("Tags"),
          ]),
        }),
      ]),
      pipe([
        switchCase([
          eq(get("code"), "ResourceNotFoundException"),
          () => undefined,
          (error) => {
            throw error;
          },
        ]),
      ])
    )();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html#listTables-property
  const getList = () =>
    pipe([
      () => ({}),
      dynamoDB().listTables,
      get("TableNames"),
      map((name) => getByName({ name })),
    ])();

  const isInstanceUp = eq(get("TableStatus"), "ACTIVE");

  const isUpByName = pipe([getByName, isInstanceUp]);
  const isDownByName = pipe([getByName, isEmpty]);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html#createTable-property
  const create = ({ payload, name, namespace }) =>
    pipe([
      () => payload,
      dynamoDB().createTable,
      tap(() =>
        retryCall({
          name: `createDynamoDBTable isUpByName: ${name}`,
          fn: () => isUpByName({ name }),
        })
      ),
      () => ({
        ResourceArn: tableArn({ TableName: name, config }),
        Tags: buildTags({ name, config, namespace }),
      }),
      tap((params) => {
        assert(true);
      }),
      dynamoDB().tagResource,
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html#deleteTable-property
  const destroy = ({ live }) =>
    pipe([
      tap(() => {
        assert(live.TableName);
      }),
      () => live,
      pickParam,
      tryCatch(
        pipe([
          dynamoDB().deleteTable,
          () =>
            retryCall({
              name: `deleteTable isDownByName: ${live.TableName}`,
              fn: () => isDownByName({ name: live.TableName }),
              config,
            }),
        ]),
        (error, params) =>
          pipe([
            tap(() => {
              logger.error(`error deleteTable ${tos({ params, error })}`);
            }),
            () => error,
            switchCase([
              eq(get("code"), "ResourceNotFoundException"),
              () => undefined,
              () => {
                throw error;
              },
            ]),
          ])()
      ),
    ])();

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
    destroy,
    getList,
    configDefault,
    shouldRetryOnException,
  };
};
