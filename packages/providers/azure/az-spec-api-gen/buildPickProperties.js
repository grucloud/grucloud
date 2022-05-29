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
const { isEmpty, flatten, values } = require("rubico/x");

const {
  isPreviousProperties,
  isOmit,
  isSwaggerObject,
  findTypesByDiscriminator,
  buildParentPath,
} = require("./AzureRestApiCommon");

const buildPickPropertiesEnum = ({ key, swagger, parentPath, accumulator }) =>
  pipe([
    fork({
      fromBase: pipe([
        pipe([
          get("properties"),
          tap((properties) => {
            assert(properties);
          }),
          buildPickProperties({
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
            buildPickProperties({
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

const buildPickPropertiesObject = ({ key, swagger, parentPath, accumulator }) =>
  pipe([
    fork({
      fromAllOf: pipe([
        get("allOf", []),
        map(
          pipe([
            get("properties"),
            buildPickProperties({
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
        buildPickProperties({
          swagger,
          parentPath: buildParentPath(key)(parentPath),
          accumulator,
        }),
      ]),
      fromAditionalProperties: switchCase([
        get("additionalProperties"),
        pipe([
          get("additionalProperties"),
          () => [buildParentPath(key)(parentPath)],
        ]),
        () => [],
      ]),
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

exports.buildPickPropertiesObject = buildPickPropertiesObject;

const buildPickPropertiesArray = ({ key, swagger, parentPath, accumulator }) =>
  pipe([
    get("items"),
    tap((items) => {
      assert(items);
    }),
    switchCase([
      isSwaggerObject,
      // array of objects
      buildPickPropertiesObject({
        key: `${key}[]`,
        swagger,
        parentPath,
        accumulator,
      }),
      // array of simple types
      pipe([() => [buildParentPath(key)(parentPath)]]),
    ]),
  ]);

const buildPickProperties =
  ({ swagger, parentPath = [], accumulator = [] }) =>
  (properties = {}) =>
    pipe([
      tap((params) => {
        assert(swagger);
      }),
      () => properties,
      map.entries(([key, obj]) => [
        key,
        pipe([
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
            // omit ?
            or([isOmit({ key, obj }) /*, get("x-ms-mutability")*/]),
            () => undefined,
            // is Array ?
            pipe([get("items")]),
            buildPickPropertiesArray({ key, swagger, parentPath, accumulator }),
            //discriminator
            pipe([get("discriminator")]),
            buildPickPropertiesEnum({ key, swagger, parentPath, accumulator }),
            // is Object
            isSwaggerObject,
            buildPickPropertiesObject({
              key,
              swagger,
              parentPath,
              accumulator,
            }),
            pipe([
              tap((params) => {
                assert(true);
              }),
              () => [buildParentPath(key)(parentPath)],
            ]),
          ]),
        ])(),
      ]),
      values,
      filter(not(isEmpty)),
      flatten,
      (results) => [...accumulator, ...results],
    ])();

exports.buildPickProperties = buildPickProperties;
