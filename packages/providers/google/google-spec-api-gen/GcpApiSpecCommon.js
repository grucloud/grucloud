const assert = require("assert");
const { pipe, or, get, not, and, tap, reduce } = require("rubico");
const {
  includes,
  callProp,
  append,
  unless,
  isEmpty,
  defaultsDeep,
  find,
} = require("rubico/x");

exports.isKeyExcluded = ({ key }) =>
  pipe([
    tap(() => {
      assert(key);
    }),
    () => [],
    includes(key),
  ]);

exports.getAllProperties = ({ allOf = [], properties = {} }) =>
  pipe([
    () => allOf,
    tap((params) => {
      assert(properties);
    }),
    reduce((acc, value) => ({ ...acc, ...value.properties }), {}),
    defaultsDeep(properties),
  ])();

exports.buildParentPath = (key) =>
  pipe([
    unless(() => isEmpty(key), append(key)),
    tap((params) => {
      assert(true);
    }),
  ]);

exports.isPreviousProperties = ({ parentPath, key }) =>
  pipe([
    tap((params) => {
      //console.log("isPreviousProperties", key, parentPath);
    }),
    or([
      and([
        () => key != "properties",
        pipe([() => parentPath, find(includes(key))]),
      ]),
    ]),
  ]);

const isSecret = (key) =>
  or([
    () => key.match(new RegExp("password$", "gi")),
    //
    //get("x-ms-secret"),
  ]);

exports.findTypesByDiscriminator =
  ({ swagger }) =>
  (typedef) =>
    pipe([
      tap((params) => {
        assert(swagger);
        assert(typedef);
      }),
      () => typedef,
      get("properties"),
      get(typedef.discriminator),
      get("enum", []),
      flatMap((enumValue) =>
        pipe([
          () => swagger,
          get("definitions"),
          filter(pipe([eq(get("x-ms-discriminator-value"), enumValue)])),
        ])()
      ),
    ])();

exports.isOmit = ({ key, obj }) =>
  pipe([
    tap((params) => {
      assert(key);
    }),
    or([
      pipe([get("description"), includes("[Output Only]")]),
      get("readOnly"),
      and([
        () => key.match(new RegExp("Id$", "gi")),
        not(
          pipe([
            () => obj,
            get("description", ""),
            callProp("startsWith", "Name"),
          ])
        ),
      ]),
      () => key.match(new RegExp("status", "gi")),
      () => key.match(new RegExp("state", "gi")),
      isSecret(key),
    ]),
  ]);
