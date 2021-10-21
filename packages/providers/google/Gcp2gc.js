const assert = require("assert");
const { pipe, tap, map } = require("rubico");
const { groupBy, values } = require("rubico/x");

const { generatorMain } = require("@grucloud/core/generatorUtils");

const { configTpl } = require("./configTpl");

const filterModel = pipe([
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
            name: "gcp2gc",
            providerConfig,
            providerType: "google",
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
