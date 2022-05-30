const assert = require("assert");
const {
  pipe,
  tap,
  filter,
  map,
  eq,
  or,
  get,
  flatMap,
  not,
  fork,
  switchCase,
} = require("rubico");
const { isEmpty, flatten, values, callProp } = require("rubico/x");

const {
  isPreviousProperties,
  isOmit,
  isSwaggerObject,
  buildParentPath,
  findTypesByDiscriminator,
  isKeyExcluded,
} = require("./AzureRestApiCommon");

const buildDefaultPropertiesObject = ({
  key,
  swagger,
  parentPath,
  accumulator,
}) =>
  pipe([
    tap((params) => {
      assert(true);
    }),
    fork({
      fromAllOf: pipe([
        get("allOf", []),
        map(
          pipe([
            get("properties"),
            buildDefaultProperties({
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
        tap((params) => {
          assert(true);
        }),
        buildDefaultProperties({
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

exports.buildDefaultPropertiesObject = buildDefaultPropertiesObject;

const buildDefaultPropertiesArray = ({
  key,
  swagger,
  parentPath,
  accumulator,
}) =>
  pipe([
    tap((params) => {
      assert(true);
      //console.log("array", key, parentPath.join("."));
    }),
    get("items"),
    tap((items) => {
      assert(items);
    }),
    switchCase([
      isPreviousProperties({ parentPath, key }),
      pipe([
        tap((params) => {
          assert(true);
          //console.log("buildDefaultPropertiesArray loop detected ", key, "\n");
        }),
        () => [],
      ]),
      isSwaggerObject,
      // array of objects
      buildDefaultPropertiesObject({
        key: `${key}[]`,
        swagger,
        parentPath,
        accumulator,
      }),
      // array of simple types
      pipe([() => []]),
    ]),
  ]);

const buildDefaultPropertiesEnum = ({
  key,
  swagger,
  parentPath,
  accumulator,
}) =>
  pipe([
    fork({
      fromBase: pipe([
        pipe([
          get("properties"),
          tap((properties) => {
            assert(properties);
          }),
          buildDefaultProperties({
            swagger,
            parentPath: buildParentPath(key)(parentPath),
            accumulator,
          }),
        ]),
      ]),
      fromEnums: pipe([
        findTypesByDiscriminator({ swagger }),
        flatMap(
          pipe([
            get("properties"),
            tap((properties) => {
              assert(properties);
            }),
            buildDefaultProperties({
              swagger,
              parentPath: buildParentPath(key)(parentPath),
              accumulator,
            }),
          ])
        ),
      ]),
    }),
    ({ fromBase, fromEnums }) => [...fromBase, ...fromEnums],
  ]);

const buildDefaultProperties =
  ({ swagger, parentPath = [], accumulator = [] }) =>
  (properties = {}) =>
    pipe([
      tap((params) => {
        assert(swagger);
        //console.log("parentPath", parentPath.join("."));
      }),
      () => properties,
      map.entries(([key, obj]) => [
        key,
        pipe([
          () => obj,
          switchCase([
            isKeyExcluded({ key }),
            pipe([
              tap((params) => {
                assert(true);
              }),
              () => undefined,
            ]),
            // loop detection
            isPreviousProperties({ parentPath, key }),
            pipe([
              tap((params) => {
                assert(true);
                //console.log("buildDefaultProperties loop detected ", key, "\n");
              }),
              () => undefined,
            ]),
            // is omit ?
            or([isOmit({ key, obj })]),
            pipe([
              tap((params) => {
                assert(true);
              }),
              () => [],
            ]),
            // default ?
            pipe([
              tap((params) => {
                assert(true);
              }),
              callProp("hasOwnProperty", "default"),
            ]),
            pipe([
              tap((params) => {
                assert(true);
              }),
              get("default"),
              (defaultValue) => [[[...parentPath, key], defaultValue]],
            ]),
            // is Array ?
            pipe([get("items")]),
            buildDefaultPropertiesArray({
              key,
              swagger,
              parentPath,
              accumulator,
            }),
            //discriminator
            //TODO
            pipe([get("discriminator")]),
            buildDefaultPropertiesEnum({
              key,
              swagger,
              parentPath,
              accumulator,
            }),
            // is Object
            isSwaggerObject,
            buildDefaultPropertiesObject({
              key,
              swagger,
              parentPath,
              accumulator,
            }),
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

exports.buildDefaultProperties = buildDefaultProperties;
