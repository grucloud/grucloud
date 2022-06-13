const assert = require("assert");
const pkg = require("./package.json");
const { tap, pipe, assign, get } = require("rubico");
const { callProp, when, includes } = require("rubico/x");

const stage = "dev";

const replaceStage = pipe([
  tap((params) => {
    assert(true);
  }),
  when(
    includes(stage),
    pipe([
      callProp("replace", stage, "${config.stage}"),
      (result) => () => "`" + result + "`",
    ])
  ),
]);

module.exports = () => ({
  projectName: pkg.name,
  location: "eastus",
  transformResourceName:
    ({ resource }) =>
    (name) =>
      pipe([
        tap((params) => {
          assert(resource);
          assert(name);
        }),
        () => name,
        when(
          includes(stage),
          pipe([
            callProp("replaceAll", stage, "${config.stage}"),
            tap((params) => {
              assert(true);
            }),
            (result) => "`" + result + "`",
          ])
        ),
      ])(),
  transformResource:
    ({ resource }) =>
    (properties) =>
      pipe([
        tap((params) => {
          assert(resource);
          assert(properties);
        }),
        () => properties,
        assign({
          name: pipe([get("name"), replaceStage]),
        }),
      ])(),
});
