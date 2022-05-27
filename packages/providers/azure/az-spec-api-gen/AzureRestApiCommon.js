const assert = require("assert");
const { pipe, eq, or, get, not, and, tap, flatMap, filter } = require("rubico");
const { includes, callProp, append, unless, isEmpty } = require("rubico/x");

const isSecret = (key) =>
  or([() => key.match(new RegExp("password$", "gi")), get("x-ms-secret")]);

exports.isSecret = isSecret;

exports.isSwaggerObject = pipe([
  tap((params) => {
    assert(true);
  }),
  or([get("properties"), get("allOf"), get("additionalProperties")]),
]);

exports.isPreviousProperties = ({ parentPath, key }) =>
  and([not(eq(key, "properties")), pipe([() => parentPath, includes(key)])]);

exports.isOmit = ({ key, obj }) =>
  pipe([
    tap((params) => {
      assert(key);
    }),
    or([
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
      //get("x-ms-mutability"),
      isSecret(key),
    ]),
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

exports.buildParentPath = (key) =>
  pipe([
    unless(() => isEmpty(key), append(key)),
    tap((params) => {
      assert(true);
    }),
  ]);
