const assert = require("assert");
const { pipe, tap, get, pick, eq, map, assign } = require("rubico");
const { defaultsDeep, find, pluck, unless, isEmpty } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { updateResourceObject } = require("@grucloud/core/updateResourceObject");

const { getNewCallerReference } = require("../AwsCommon");

const pickId = pipe([
  tap(({ Id }) => {
    assert(Id);
  }),
  pick(["Id"]),
]);

const toCollectionId = ({ Id }) => ({ CollectionId: Id });

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53.html#listCidrBlocks-property
const decorate =
  ({ endpoint, config }) =>
  (live) =>
    pipe([
      tap((params) => {
        assert(endpoint);
      }),
      () => live,
      assign({
        Locations: pipe([
          toCollectionId,
          endpoint().listCidrLocations,
          get("CidrLocations"),
          map(({ LocationName }) =>
            pipe([
              () => ({ CollectionId: live.Id, LocationName }),
              endpoint().listCidrBlocks,
              get("CidrBlocks"),
              pluck("CidrBlock"),
              (CidrList) => ({ CidrList, LocationName }),
            ])()
          ),
        ]),
      }),
    ])();

const putCidr = ({ endpoint, live }) =>
  pipe([
    tap((params) => {
      assert(params);
    }),
    assign({ Action: () => "PUT" }),
    (Change) => ({ Id: live.Id, Changes: [Change] }),
    endpoint().changeCidrCollection,
  ]);

const updateCidr = ({ endpoint, live }) =>
  pipe([
    tap((params) => {
      assert(params);
    }),
    // assign({ Action: () => "PUT" }),
    // (Change) => ({ Id: live.Id, Changes: [Change] }),
    // endpoint().changeCidrCollection,
  ]);

//
const deleteCidr = ({ endpoint, live }) =>
  pipe([
    assign({ Action: () => "DELETE_IF_EXISTS" }),
    (Change) => ({ Id: live.Id, Changes: [Change] }),
    endpoint().changeCidrCollection,
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53.html
exports.Route53CidrCollection = () => ({
  type: "CidrCollection",
  package: "route-53",
  client: "Route53",
  propertiesDefault: {},
  omitProperties: ["Id", "Arn", "Version", "CallerReference"],
  inferName: () =>
    pipe([
      get("Name"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("Name"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("Arn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["NoSuchCidrCollectionException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53.html#listCidrCollections-property
  getById: {
    method: "listCidrCollections",
    pickId,
    decorate: ({ live }) =>
      pipe([get("CidrCollections"), find(eq(get("Id"), live.Id))]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53.html#listCidrCollections-property
  getList: {
    method: "listCidrCollections",
    getParam: "CidrCollections",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53.html#createCidrCollection-property
  create: {
    method: "createCidrCollection",
    pickCreated: ({ payload }) => pipe([get("Collection")]),
    postCreate:
      ({ endpoint, payload, created }) =>
      (live) =>
        pipe([
          tap(() => {
            assert(live.Id);
            assert(payload.Locations);
          }),
          () => payload,
          get("Locations"),
          map(assign({ Action: () => "PUT" })),
          (Changes) => ({ Id: live.Id, Changes }),
          endpoint().changeCidrCollection,
        ])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53.html#changeCidrCollection-property
  update: {
    method: "changeCidrCollection",
    filterParams: ({ payload, diff, live }) =>
      pipe([
        () => ({ payload, live, diff }),
        updateResourceObject({
          endpoint,
          arrayPath: "Locations",
          onAdded: putCidr,
          onUpdated: updateCidr,
          onDeleted: deleteCidr,
        }),
      ])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53.html#deleteCidrCollection-property
  destroy: {
    preDestroy: ({ endpoint, payload }) =>
      tap((live) =>
        pipe([
          tap(() => {
            assert(live.Id);
          }),
          () => live,
          get("Locations"),
          map(assign({ Action: () => "DELETE_IF_EXISTS" })),
          unless(
            isEmpty,
            pipe([
              (Changes) => ({ Id: live.Id, Changes }),
              endpoint().changeCidrCollection,
            ])
          ),
        ])()
      ),
    method: "deleteCidrCollection",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: {},
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({ CallerReference: getNewCallerReference() }),
    ])(),
});
