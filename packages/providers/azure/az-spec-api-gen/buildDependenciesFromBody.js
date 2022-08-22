const assert = require("assert");
const {
  pipe,
  tap,
  filter,
  map,
  eq,
  or,
  get,
  not,
  fork,
  switchCase,
  assign,
} = require("rubico");
const {
  isEmpty,
  flatten,
  values,
  callProp,
  isObject,
  last,
  when,
} = require("rubico/x");

const {
  isPreviousProperties,
  isOmit,
  isSwaggerObject,
  buildParentPath,
  isKeyExcluded,
  getAllProperties,
  resolveSwaggerObject,
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
    keyId: "sourceVault.id",
  },
  keyUrl: {
    type: "Key",
    group: "KeyVault",
  },
  serverFarmId: {
    type: "AppServicePlan",
    group: "Web",
  },
  customerId: {
    type: "Workspace",
    group: "OperationalInsights",
  },
  publicKeys: {
    type: "SshPublicKey",
    group: "Compute",
    list: true,
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
    tap((params) => {
      assert(params);
    }),
    getAllProperties,
    buildDependenciesFromBody({
      swagger,
      parentPath: buildParentPath(key)(parentPath),
      accumulator,
    }),
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

const preDefinedDependenciesPathId = ({ parentPath, key }) =>
  pipe([
    fork({
      pathId: pipe([
        () => PreDefinedDependenciesMap,
        get(`${key}.keyId`, key),
        tap((params) => {
          assert(true);
        }),

        (keyId) => [...parentPath, keyId],
        callProp("join", "."),
      ]),
      depId: pipe([() => key]),
    }),
  ]);

const buildDependenciesFromBody =
  ({ swagger, parentPath = [], accumulator = [] }) =>
  (properties = {}) =>
    pipe([
      () => properties,
      map.entries(([key, obj]) => [
        key,
        pipe([
          () => obj,
          resolveSwaggerObject,
          switchCase([
            isKeyExcluded({ key }),
            pipe([
              tap((params) => {
                assert(true);
              }),
              () => undefined,
            ]),
            // readOnly
            pipe([get("readOnly")]),
            pipe([
              tap((params) => {
                assert(true);
              }),
              () => undefined,
            ]),
            // loop detection
            isPreviousProperties({ parentPath, key }),
            pipe([() => undefined]),
            // Pre defined dependencies
            pipe([() => PreDefinedDependenciesMap[key]]),
            pipe([
              preDefinedDependenciesPathId({ parentPath, key }),
              (result) => [result],
            ]),

            pipe([get("x-ms-azure-resource")]),
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
            pipe([get("x-ms-arm-id-details")]),
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
                  allowedResources: obj["x-ms-arm-id-details"].allowedResources,
                },
              ],
            ]),
            // Find properties.id
            pipe([get("properties.id")]),
            pipe([
              () => [...parentPath, key, "id"],
              callProp("join", "."),
              (pathId) => [
                {
                  pathId,
                  depId: key,
                },
              ],
            ]),
            // Find id
            pipe([() => key === "id"]),
            pipe([
              fork({
                pathId: pipe([
                  () => [...parentPath, key],
                  callProp("join", "."),
                ]),
                depId: pipe([
                  () => parentPath,
                  last,
                  when(isEmpty, () => "id"),
                ]),
              }),
              (result) => [result],
            ]),
            pipe([eq(get("type"), "boolean")]),
            pipe([() => []]),
            // Find MyPropId
            pipe([() => key, callProp("match", new RegExp("Id$", "gi"))]),
            pipe([
              tap((params) => {
                assert(true);
              }),
              fork({
                pathId: pipe([
                  () => [...parentPath, key],
                  callProp("join", "."),
                ]),
                depId: () => key,
              }),
              (result) => [result],
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
