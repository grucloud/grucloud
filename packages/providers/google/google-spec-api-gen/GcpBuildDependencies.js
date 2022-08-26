const assert = require("assert");
const {
  pipe,
  tap,
  filter,
  map,
  eq,
  fork,
  and,
  get,
  not,
  switchCase,
} = require("rubico");
const {
  isEmpty,
  flatten,
  values,
  callProp,
  isObject,
  includes,
} = require("rubico/x");

const { getAllProperties, buildParentPath } = require("./GcpApiSpecCommon");

const buildDependenciesObject = ({ key, inventory, parentPath, accumulator }) =>
  pipe([
    tap((params) => {
      assert(params);
    }),
    getAllProperties,
    buildDependencies({
      inventory,
      parentPath: buildParentPath(key)(parentPath),
      accumulator,
    }),
  ]);

exports.buildDependenciesObject = buildDependenciesObject;

const buildDependenciesArray = ({ key, inventory, parentPath, accumulator }) =>
  pipe([
    get("items"),
    tap((items) => {
      assert(items);
    }),
    switchCase([
      get("properties"),
      // array of objects
      pipe([
        get("properties"),
        buildDependencies({
          key: `${key}[]`,
          inventory,
          parentPath,
          accumulator,
        }),
      ]),
      // array of simple types
      pipe([() => []]),
    ]),
  ]);

const buildDependencies =
  ({ inventory, parentPath = [], accumulator = [] }) =>
  (properties = {}) =>
    pipe([
      tap((params) => {
        assert(true);
      }),
      () => properties,
      map.entries(([key, obj]) => [
        key,
        pipe([
          () => obj,
          tap((params) => {
            assert(key);
          }),
          switchCase([
            pipe([get("enum")]),
            () => [],
            pipe([eq(get("type"), "boolean")]),
            () => [],
            pipe([eq(get("type"), "float")]),
            () => [],
            pipe([eq(get("type"), "number")]),
            () => [],
            and([get("selfLink"), () => !isEmpty(parentPath)]),
            pipe([
              tap((params) => {
                assert(true);
              }),
              () => [...parentPath, key, "selfLink"],
              callProp("join", "."),
              (pathId) => [
                {
                  pathId,
                  depId: key,
                },
              ],
            ]),
            and([
              pipe([get("description"), includes("URL")]),
              //() => !isEmpty(parentPath),
              not(pipe([get("description"), includes("[Output Only]")])),
              eq(get("type"), "string"),
            ]),
            pipe([
              tap((params) => {
                assert(true);
              }),
              fork({
                pathId: pipe([
                  switchCase([
                    get("items"),
                    () => [...parentPath, `${key}[]`],
                    () => [...parentPath, key],
                  ]),
                  callProp("join", "."),
                ]),
                depId: pipe([() => key]),
              }),
              (x) => [x],
            ]),
            pipe([get("items")]),
            buildDependenciesArray({
              key,
              inventory,
              parentPath,
              accumulator,
            }),
            pipe([eq(get("type"), "string")]),
            () => [],
            Array.isArray,
            pipe([
              tap((params) => {
                assert(true);
              }),
              () => [],
            ]),
            isObject,
            buildDependenciesObject({
              key,
              inventory,
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
