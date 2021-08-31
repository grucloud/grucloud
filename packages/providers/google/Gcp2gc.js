const assert = require("assert");
const {
  pipe,
  tap,
  get,
  eq,
  pick,
  switchCase,
  omit,
  not,
  or,
  and,
  assign,
  map,
  any,
  fork,
  filter,
} = require("rubico");
const Axios = require("axios");
const {
  size,
  first,
  find,
  identity,
  pluck,
  includes,
  when,
  callProp,
  isEmpty,
  groupBy,
  values,
} = require("rubico/x");

const path = require("path");
const mime = require("mime-types");
const Fs = require("fs");
const fs = require("fs").promises;

const { generatorMain } = require("@grucloud/core/generatorUtils");

//const { omitIfEmpty } = require("@grucloud/core/Common");

const { configTpl } = require("./configTpl");
const { iacTpl } = require("./iacTpl");

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
            iacTpl,
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
