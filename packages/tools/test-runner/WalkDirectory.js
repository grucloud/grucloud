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
  and,
} = require("rubico");
const {
  filterOut,
  isIn,
  callProp,
  isEmpty,
  find,
  keys,
  includes,
} = require("rubico/x");

const constants = require("fs");
const { readdir } = require("fs").promises;

const path = require("path");
const fs = require("fs").promises;

const ExcludeDirsDefault = [
  //
  ".DS_Store",
  "node_modules",
  "artifacts",
  "kops", // TODO update
  "docker", // TODO move docker dir out of the example
  "xray-lambdalayers-cdk-python",
  "stepfunctions-eventbridge-lambda-sam-java",
  "role-everywhere",
  "lambda-layer-terraform",
  "retail-store-sample-app",
  "appflow-redshift",
  "apprunner-secrets-manager",
  "apigw-http-eventbridge-terraform",
  "aws-route53-recovery-control-config",
];

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

const filterExcludeFiles = ({ excludeDirs }) =>
  filterOut(
    pipe([
      get("name"),
      tap((content) => {
        assert(content);
      }),
      isIn([excludeDirs, ...ExcludeDirsDefault]),
    ])
  );

const isGruCloudExample = ({ directory, name }) =>
  pipe([
    get("name"),
    (fileName) => path.resolve(directory, name, fileName),
    (filename) => fs.readFile(filename, "utf-8"),
    tap((content) => {
      assert(content);
    }),
    JSON.parse,
    tap((content) => {
      assert(content);
    }),
    get("dependencies"),
    keys,
    any(includes("@grucloud/core")),
  ]);

const walkDirectoryUnit =
  ({ excludeDirs = [], directory }) =>
  (name) =>
    pipe([
      () => name,
      tap((params) => {
        assert(directory);
        assert(name);
      }),
      () => readdir(path.resolve(directory, name), { withFileTypes: true }),
      filterExcludeFiles({ excludeDirs }),
      tap((params) => {
        assert(true);
      }),
      (dirs) =>
        pipe([
          () => dirs,
          switchCase([
            and([
              find(eq(get("name"), "resources.js")),
              find(eq(get("name"), "package.json")),
            ]),
            pipe([() => [{ name, directory: path.resolve(directory, name) }]]),
            pipe([
              filter(callProp("isDirectory")),
              flatMap(
                pipe([
                  get("name"),
                  walkDirectoryUnit({
                    excludeDirs,
                    directory: path.resolve(directory, name),
                  }),
                ])
              ),
            ]),
          ]),
        ])(),
      tap((params) => {
        assert(true);
      }),
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
      filterExcludeFiles({ excludeDirs }),

      flatMap(
        pipe([get("name"), walkDirectoryUnit({ excludeDirs, directory })])
      ),
      tap((directory) => {
        assert(true);
      }),
    ])();
