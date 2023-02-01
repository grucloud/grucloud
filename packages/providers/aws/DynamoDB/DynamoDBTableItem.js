const assert = require("assert");
const { pipe, tap, get, pick, fork, map, omit, tryCatch } = require("rubico");
const {
  defaultsDeep,
  callProp,
  keys,
  unless,
  isEmpty,
  filterOut,
} = require("rubico/x");

const { getField } = require("@grucloud/core/ProviderCommon");

const pickId = pipe([
  tap(({ Key, TableName }) => {
    assert(Key);
    assert(TableName);
  }),
  pick(["Key", "TableName"]),
]);

const decorate = ({ endpoint, config, live }) =>
  pipe([
    tap((params) => {
      assert(live);
      assert(live.TableName);
      assert(live.Key);
    }),
    omit(keys(live.Key)),
    (Attributes) => ({ Attributes }),
    defaultsDeep({ TableName: live.TableName, Key: live.Key }),
  ]);

const filterPayload = ({ TableName, Key, Attributes }) =>
  pipe([
    () => ({ TableName, Item: { ...Key, ...Attributes } }),
    tap((params) => {
      assert(true);
    }),
  ])();

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html
exports.DynamoDBTableItem = () => ({
  type: "TableItem",
  package: "dynamodb",
  client: "DynamoDB",
  propertiesDefault: {},
  omitProperties: ["TableName"],
  inferName:
    ({ dependenciesSpec: { table } }) =>
    ({ Key }) =>
      pipe([
        tap((params) => {
          assert(table);
          assert(Key);
        }),
        () => `${table}::${JSON.stringify(Key)}`,
      ])(),
  findName:
    () =>
    ({ TableName, Key }) =>
      pipe([
        tap((params) => {
          assert(TableName);
          assert(Key);
        }),
        () => `${TableName}::${JSON.stringify(Key)}`,
      ])(),
  findId:
    () =>
    ({ TableName, Key }) =>
      pipe([
        tap((params) => {
          assert(TableName);
          assert(Key);
        }),
        () => `${TableName}::${JSON.stringify(Key)}`,
      ])(),
  ignoreErrorCodes: ["ResourceNotFoundException"],
  dependencies: {
    table: {
      type: "Table",
      group: "DynamoDB",
      parent: true,
      dependencyId: ({ lives, config }) =>
        pipe([
          get("TableName"),
          lives.getByName({
            type: "Table",
            group: "DynamoDB",
            providerName: config.providerName,
          }),
          get("id"),
        ]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html#getTableItem-property
  getById: {
    method: "getItem",
    getField: "Item",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html#getItem-property
  getList:
    ({ lives, client, endpoint, getById, config }) =>
    ({ lives, resources = [] }) =>
      pipe([
        () => resources,
        map(
          pipe([
            fork({
              TableName: pipe([
                callProp("resolveDependencies", {}),
                get("table.config.TableName"),
              ]),
              Key: pipe([callProp("properties", {}), get("Key")]),
            }),
            tryCatch(
              ({ TableName, Key }) =>
                pipe([
                  () => ({ TableName, Key }),
                  endpoint().getItem,
                  get("Item"),
                  unless(
                    isEmpty,
                    pipe([
                      omit(keys(Key)),
                      (Attributes) => ({ Attributes }),
                      defaultsDeep({ TableName, Key }),
                    ])
                  ),
                ])(),
              (error) => undefined
            ),
          ])
        ),
        filterOut(isEmpty),
      ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html#putItem-property
  create: {
    method: "putItem",
    filterPayload,
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html#putItem-property
  update: {
    method: "putItem",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, filterPayload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html#deleteItem-property
  destroy: {
    method: "deleteItem",
    pickId,
  },
  getByName:
    ({ getById }) =>
    ({ name, resolvedDependencies: { table }, properties }) =>
      pipe([
        tap((params) => {
          assert(table);
          assert(properties);
        }),
        () => ({ TableItemName: name }),
        properties,
        pick(["Key"]),
        tap(({ Key }) => {
          assert(Key);
        }),
        defaultsDeep({ TableName: table.config.TableName }),
        tap((params) => {
          assert(true);
        }),

        getById({}),
        tap((params) => {
          assert(true);
        }),
      ])(),
  configDefault: ({
    properties: { ...otherProps },
    dependencies: { table },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(table);
      }),
      () => otherProps,
      defaultsDeep({
        TableName: getField(table, "TableName"),
      }),
    ])(),
});
