const assert = require("assert");
const { pipe, tap } = require("rubico");

const { generatorMain, filterModel } = require("@grucloud/core/generatorUtils");

const { configTpl } = require("./configTpl");

exports.generateCode = ({
  specs,
  providers,
  providerConfig,
  commandOptions,
  programOptions,
}) =>
  pipe([
    tap(() => {
      assert(specs);
    }),
    () =>
      generatorMain({
        name: "gcp2gc",
        providers,
        providerConfig,
        providerType: "google",
        specs,
        commandOptions,
        programOptions,
        configTpl,
        filterModel: filterModel({ field: "labels" }),
      }),
    // () =>
    //   downloadAssets({
    //     writersSpec,
    //     commandOptions,
    //     programOptions,
    //   }),
  ])();
