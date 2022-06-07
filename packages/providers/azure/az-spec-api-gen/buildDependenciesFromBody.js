const assert = require("assert");
const {
  pipe,
  tap,
  filter,
  map,
  and,
  eq,
  or,
  get,
  flatMap,
  not,
  fork,
  switchCase,
} = require("rubico");
const {
  isEmpty,
  flatten,
  values,
  callProp,
  isString,
  isObject,
} = require("rubico/x");

const {
  isPreviousProperties,
  isOmit,
  isSwaggerObject,
  findTypesByDiscriminator,
  buildParentPath,
} = require("./AzureRestApiCommon");

const PreDefinedDependenciesMap = {
  virtualNetworkSubnetResourceId: {
    type: "Subnet",
    group: "Network",
  },
  virtualNetworkSubnetId: {
    type: "Subnet",
    group: "Network",
  },
  sourceVault: {
    type: "Vault",
    group: "KeyVault",
  },
  keyUrl: {
    type: "Key",
    group: "KeyVault",
  },
  serverFarmId: {
    type: "AppServicePlan",
    group: "Web",
  },
};

exports.PreDefinedDependenciesMap = PreDefinedDependenciesMap;

const buildDependenciesFromBodyObject = ({
  key,
  swagger,
  parentPath,
  accumulator,
}) =>
  pipe([
    fork({
      fromAllOf: pipe([
        get("allOf", []),
        map(
          pipe([
            get("properties"),
            buildDependenciesFromBody({
              swagger,
              parentPath: buildParentPath(key)(parentPath),
              accumulator,
            }),
          ])
        ),
        flatten,
      ]),
      fromProperties: pipe([
        get("properties"),
        buildDependenciesFromBody({
          swagger,
          parentPath: buildParentPath(key)(parentPath),
          accumulator,
        }),
      ]),
      // fromAditionalProperties: switchCase([
      //   get("additionalProperties"),
      //   pipe([
      //     get("additionalProperties"),
      //     () => [buildParentPath(key)(parentPath)],
      //   ]),
      //   () => [],
      // ]),
    }),
    ({ fromAllOf = [], fromProperties = [], fromAditionalProperties = [] }) => [
      ...fromAllOf,
      ...fromProperties,
      ...fromAditionalProperties,
    ],
    tap((params) => {
      assert(true);
    }),
  ]);

exports.buildDependenciesFromBodyObject = buildDependenciesFromBodyObject;

const buildDependenciesFromBodyArray = ({
  key,
  swagger,
  parentPath,
  accumulator,
}) =>
  pipe([
    get("items"),
    tap((items) => {
      assert(items);
    }),
    switchCase([
      isSwaggerObject,
      // array of objects
      buildDependenciesFromBodyObject({
        key: `${key}[]`,
        swagger,
        parentPath,
        accumulator,
      }),
      // array of simple types
      pipe([() => []]),
    ]),
  ]);

const buildDependenciesFromBody =
  ({ swagger, parentPath = [], accumulator = [] }) =>
  (properties = {}) =>
    pipe([
      tap((params) => {
        assert(swagger);
        //console.log("\n\nparentPath", parentPath);
      }),
      () => properties,
      map.entries(([key, obj]) => [
        key,
        pipe([
          tap((params) => {
            //console.log("key ", key, JSON.stringify(obj));
          }),
          () => obj,
          switchCase([
            // loop detection
            isPreviousProperties({ parentPath, key }),
            pipe([
              tap((params) => {
                assert(true);
              }),
              () => undefined,
            ]),
            pipe([() => PreDefinedDependenciesMap[key]]),
            pipe([
              () => [...parentPath, key],
              callProp("join", "."),
              (pathId) => [
                {
                  pathId,
                  depId: key,
                },
              ],
            ]),
            // Find properties.id
            pipe([get("properties.id")]),
            pipe([
              tap((params) => {
                assert(true);
              }),
              () => [...parentPath, key, "id"],
              callProp("join", "."),
              (pathId) => [
                {
                  pathId,
                  depId: key,
                },
              ],
            ]),
            pipe([eq(get("type"), "boolean")]),
            pipe([() => []]),
            // Find MyPropId
            pipe([() => key, callProp("match", new RegExp("Id$", "gi"))]),
            pipe([
              tap((params) => {
                assert(true);
              }),
              () => [...parentPath, key],
              callProp("join", "."),
              (pathId) => [
                {
                  pathId,
                  depId: key,
                },
              ],
            ]),
            // Omit ?
            or([isOmit({ key, obj }) /*, get("x-ms-mutability")*/]),
            () => undefined,
            // is Array ?
            pipe([get("items")]),
            buildDependenciesFromBodyArray({
              key,
              swagger,
              parentPath,
              accumulator,
            }),
            // Is object ?
            isObject,
            buildDependenciesFromBodyObject({
              key,
              swagger,
              parentPath,
              accumulator,
            }),
            // None of the above
            pipe([
              tap((params) => {
                assert(true);
              }),
              () => [],
            ]),
          ]),
        ])(),
      ]),
      values,
      filter(not(isEmpty)),
      flatten,
      (results) => [...accumulator, ...results],
    ])();

exports.buildDependenciesFromBody = buildDependenciesFromBody;
