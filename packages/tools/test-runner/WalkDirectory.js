const assert = require("assert");
const {
  eq,
  map,
  pipe,
  tap,
  tryCatch,
  get,
  filter,
  switchCase,
  flatMap,
  any,
} = require("rubico");
const {
  filterOut,
  isIn,
  callProp,
  isEmpty,
  unless,
  keys,
  includes,
} = require("rubico/x");

const constants = require("fs");
const { readdir } = require("fs").promises;

const path = require("path");
const fs = require("fs").promises;

const fileExist = pipe([
  tap((directory) => {
    assert(directory);
  }),
  tryCatch(
    tap(pipe([(fileName) => fs.access(fileName, constants.F_OK)])),
    (error, filename) =>
      pipe([
        tap(() => {
          assert(error);
        }),
        () => {
          throw Error(`directory '${filename}' does not exist`);
        },
      ])()
  ),
]);

const ExcludeDirsDefault = [".DS_Store", "node_modules"];

const filterExcludeFiles = ({ excludeDirs }) =>
  filterOut(pipe([get("name"), isIn([excludeDirs, ...ExcludeDirsDefault])]));

const isGruCloudExample = ({ directory, name }) =>
  pipe([
    get("name"),
    (fileName) => path.resolve(directory, name, fileName),
    (filename) => fs.readFile(filename, "utf-8"),
    JSON.parse,
    get("dependencies"),
    keys,
    any(includes("@grucloud/core")),
  ]);

const walkDirectoryUnit =
  ({ excludeDirs = [], directory }) =>
  (name) =>
    pipe([
      () => name,
      tap((name) => {
        assert(directory);
        assert(name);
      }),
      () => readdir(path.resolve(directory, name), { withFileTypes: true }),
      filterExcludeFiles({ excludeDirs }),
      flatMap(
        switchCase([
          // isDir ?
          callProp("isDirectory"),
          pipe([
            get("name"),
            walkDirectoryUnit({
              excludeDirs,
              directory: path.resolve(directory, name),
            }),
          ]),
          // is GruCloud Example ?
          eq(get("name"), "package.json"),
          pipe([
            switchCase([
              isGruCloudExample({ directory, name }),
              () => [{ name, directory: path.resolve(directory, name) }],
              pipe([() => []]),
            ]),
          ]),
          // Default
          pipe([() => undefined]),
        ])
      ),
      filterOut(isEmpty),
    ])();

exports.walkDirectory =
  ({ excludeDirs = [] }) =>
  (directory) =>
    pipe([
      //
      () => directory,
      fileExist,
      () => readdir(directory, { withFileTypes: true }),
      filter(callProp("isDirectory")),
      flatMap(
        pipe([get("name"), walkDirectoryUnit({ excludeDirs, directory })])
      ),
      tap((directory) => {
        assert(true);
      }),
    ])();
