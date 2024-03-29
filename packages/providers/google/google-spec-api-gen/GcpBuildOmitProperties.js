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
  buildParentPath,
  findTypesByDiscriminator,
  getAllProperties,
  isKeyExcluded,
} = require("./GcpApiSpecCommon");

const buildOmitPropertiesObject = ({ key, swagger, parentPath, accumulator }) =>
  pipe([
    tap((params) => {
      assert(true);
    }),
    getAllProperties,
    buildOmitProperties({
      swagger,
      parentPath: buildParentPath(key)(parentPath),
      accumulator,
    }),
    tap((params) => {
      assert(true);
    }),
  ]);

exports.buildOmitPropertiesObject = buildOmitPropertiesObject;

const buildOmitPropertiesArray = ({ key, swagger, parentPath, accumulator }) =>
  pipe([
    get("items"),
    tap((items) => {
      assert(items);
    }),
    switchCase([
      isSwaggerObject,
      // array of objects
      buildOmitPropertiesObject({
        key: `${key}[]`,
        swagger,
        parentPath,
        accumulator,
      }),
      // array of simple types
      pipe([() => []]),
    ]),
  ]);

const buildOmitPropertiesEnum = ({ key, swagger, parentPath, accumulator }) =>
  pipe([
    fork({
      fromBase: pipe([
        pipe([
          getAllProperties,
          buildOmitProperties({
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
            getAllProperties,
            buildOmitProperties({
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

const buildOmitProperties =
  ({ swagger = {}, parentPath = [], accumulator = [] }) =>
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
              }),
              () => undefined,
            ]),
            // omit ?
            or([isOmit({ key, obj }) /*, get("x-ms-mutability")*/]),
            pipe([
              tap((params) => {
                assert(true);
              }),
              () => [[...parentPath, key]],
            ]),
            // is Array ?
            pipe([get("items")]),
            buildOmitPropertiesArray({ key, swagger, parentPath, accumulator }),
            //discriminator
            //TODO
            pipe([get("discriminator")]),
            buildOmitPropertiesEnum({ key, swagger, parentPath, accumulator }),
            // is Object
            isSwaggerObject,
            buildOmitPropertiesObject({
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
      tap((params) => {
        assert(true);
      }),
    ])();

exports.buildOmitProperties = buildOmitProperties;
