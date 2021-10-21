const assert = require("assert");
const {
  pipe,
  tap,
  get,
  not,
  assign,
  map,
  any,
  fork,
  filter,
} = require("rubico");
const { isEmpty, groupBy, values, unless } = require("rubico/x");

const { generatorMain } = require("@grucloud/core/generatorUtils");
const { omitIfEmpty } = require("@grucloud/core/Common");

const { configTpl } = require("./configTpl");

const filterModel = pipe([
  map(
    assign({
      live: pipe([
        get("live"),
        assign({
          tags: pipe([
            get("tags"),
            unless(
              isEmpty,
              pipe([
                map.entries(([key, value]) => [
                  key,
                  key.startsWith("gc-") ? undefined : value,
                ]),
                filter(not(isEmpty)),
              ])
            ),
          ]),
        }),
        omitIfEmpty(["tags"]),
      ]),
    })
  ),
  tap((params) => {
    assert(true);
  }),
]);
exports.generateCode = ({
  specs,
  providerConfig,
  commandOptions,
  programOptions,
}) =>
  pipe([
    tap(() => {
      assert(specs);
      assert(providerConfig);
      assert(programOptions);
      assert(commandOptions);
    }),
    () => specs,
    groupBy("group"),
    tap((params) => {
      assert(true);
    }),
    map.entries(([key, value]) => [key, { group: key, types: value }]),
    values,
    tap((params) => {
      assert(true);
    }),
    (writersSpec) =>
      pipe([
        () =>
          generatorMain({
            name: "az2gc",
            providerConfig,
            providerType: "azure",
            writersSpec,
            commandOptions,
            programOptions,
            configTpl,
            filterModel,
          }),
        // () =>
        //   downloadAssets({
        //     writersSpec,
        //     commandOptions,
        //     programOptions,
        //   }),
      ])(),
  ])();
