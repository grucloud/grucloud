const assert = require("assert");
const { pipe, tap, get, pick, map, fork } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");

const pickId = pipe([
  tap(({ LFTags, Resource }) => {
    assert(LFTags);
    assert(Resource);
  }),
  pick(["LFTags", "Resource"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

const findName = () =>
  pipe([
    get("Resource"),
    fork({
      DatabaseName: get("Database.Name"),
      TableName: get("Table.Name"),
    }),
    ({ DatabaseName, TableName }) => DatabaseName || TableName,
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/LakeFormation.html
exports.LakeFormationResourceLFTags = () => ({
  type: "ResourceLFTags",
  package: "lakeformation",
  client: "LakeFormation",
  propertiesDefault: {},
  omitProperties: [],
  inferName:
    ({ dependenciesSpec: { database, table } }) =>
    () =>
      pipe([
        tap((params) => {
          assert(database);
          assert(table);
        }),
        () => database || table,
      ])(),
  findName,
  findId: findName,
  ignoreErrorCodes: [
    "ResourceNotFoundException",
    "InvalidInputException",
    "EntityNotFoundException",
  ],
  dependencies: {
    database: {
      type: "Database",
      group: "Glue",
      dependencyId: ({ lives, config }) =>
        pipe([
          get("Resource.Database.Name"),
          tap((DatabaseName) => {
            assert(true);
          }),
        ]),
    },
    table: {
      type: "Table",
      group: "Glue",
      parent: true,
      dependencyId: ({ lives, config }) =>
        pipe([
          get("Resource.Table.Name"),
          tap((TableName) => {
            assert(true);
          }),
        ]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/LakeFormation.html#getResourceLFTags-property
  getById: {
    method: "getResourceLFTags",
    getField: "ResourceLFTags",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/LakeFormation.html#listResourceLFTagss-property
  getList:
    ({ lives, client, endpoint, getById, config }) =>
    ({ lives }) =>
      pipe([
        fork({
          databaseTags: pipe([
            lives.getByType({
              type: "Database",
              group: "Glue",
              providerName: config.providerName,
            }),
            map(
              pipe([
                get("live"),
                tap(({ Name }) => {
                  assert(Name);
                }),
                ({ Name, CatalogId }) => ({
                  Database: { Name, CatalogId },
                }),
                (Resource) =>
                  pipe([
                    () => ({ Resource }),
                    endpoint().getResourceLFTags,
                    get("LFTagOnDatabase"),
                    (LFTags) => ({ LFTags, Resource }),
                  ])(),
              ])
            ),
          ]),
          tableTags: pipe([
            lives.getByType({
              type: "Table",
              group: "Glue",
              providerName: config.providerName,
            }),
            map(
              pipe([
                get("live"),
                tap(({ Name, DatabaseName }) => {
                  assert(Name);
                  assert(DatabaseName);
                }),
                ({ Name, DatabaseName, CatalogId }) => ({
                  Table: { Name, DatabaseName, CatalogId },
                }),
                (Resource) =>
                  pipe([
                    () => ({ Resource }),
                    endpoint().getResourceLFTags,
                    get("LFTagsOnTable"),
                    (LFTags) => ({ LFTags, Resource }),
                  ])(),
              ])
            ),
          ]),
        }),
        ({ databaseTags = [], tableTags = [] }) => [
          ...databaseTags,
          ...tableTags,
        ],
      ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/LakeFormation.html#createResourceLFTags-property
  create: {
    method: "addLFTagsToResource",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/LakeFormation.html#updateResourceLFTags-property
  // TODO update
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/LakeFormation.html#removeLFTagsFromResource-property
  destroy: {
    method: "removeLFTagsFromResource",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: {},
    config,
  }) => pipe([() => otherProps, defaultsDeep({})])(),
});
