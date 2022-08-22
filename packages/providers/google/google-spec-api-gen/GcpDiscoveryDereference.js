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
  switchCase,
  assign,
  reduce,
} = require("rubico");
const { when, isObject, identity } = require("rubico/x");

const dereference = ({ schemas }) =>
  pipe([
    tap((obj) => {
      assert(schemas);
    }),
    switchCase([
      Array.isArray,
      map((obj) => dereference({ schemas })(obj)),
      isObject,
      pipe([
        Object.entries,
        map(([key, value]) =>
          pipe([
            switchCase([
              () => key === "$ref",
              pipe([() => [dereference({ schemas })(schemas[value])]]),
              pipe([() => [key, dereference({ schemas })(value)]]),
            ]),
          ])()
        ),
        reduce(
          (acc, [key, value]) =>
            switchCase([
              () => isObject(key),
              () => ({ ...acc, ...key }),
              () => ({ ...acc, [key]: value }),
            ])(),
          {}
        ),
      ]),
      identity,
    ]),
  ]);

exports.discoveryDereference = (discovery) =>
  pipe([
    () => discovery,
    assign({
      resources: pipe([
        get("resources"),
        map(
          pipe([
            assign({
              methods: pipe([
                get("methods"),
                assign({
                  get: pipe([
                    get("get"),
                    assign({
                      response: pipe([
                        get("response"),
                        tap((params) => {
                          assert(true);
                        }),
                        dereference(discovery),
                        tap((params) => {
                          assert(true);
                        }),
                      ]),
                    }),
                    tap((params) => {
                      assert(true);
                    }),
                  ]),
                }),
              ]),
            }),
          ])
        ),
      ]),
    }),
  ])();
