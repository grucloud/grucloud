const assert = require("assert");
const { pipe, tap, map, get, switchCase, assign, reduce } = require("rubico");
const { isObject, identity } = require("rubico/x");

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
        // Cannot use Object.fromEntries because key can be an object.
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

exports.discoveryDereference = ({ schemas }) =>
  pipe([
    map(
      assign({
        methods: ({ methods }) =>
          pipe([
            () => methods,
            map(
              assign({
                response: pipe([
                  get("response"),
                  tap((response) => {
                    //assert(response);
                  }),
                  dereference({ schemas }),
                ]),
              })
            ),
          ])(),
      })
    ),
  ]);
