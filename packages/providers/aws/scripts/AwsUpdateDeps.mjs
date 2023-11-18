import assert from "assert";
import rubico from "rubico";
import rubicox from "rubico/x/index.js";
import fs from "fs/promises";
import Path from "path";

const {
  pipe,
  tap,
  get,
  flatMap,
  switchCase,
  filter,
  or,
  tryCatch,
  any,
  eq,
  map,
  set,
  reduce,
} = rubico;
const {
  callProp,
  filterOut,
  isIn,
  isEmpty,
  first,
  find,
  last,
  prepend,
  append,
} = rubicox;

const ExcludeFiles = ["node_modules", "docker", "kops", "cloudwan"];

const { GROUPS } = await import("../AwsProviderSpec.js");

const walkDirectory =
  ({ includePattern = "package.json", onFile, pathsNested = [] }) =>
  (directory) =>
    pipe([
      () => Path.resolve(directory),
      (thePath) => fs.readdir(thePath, { withFileTypes: true }),
      filterOut(pipe([get("name"), isIn(ExcludeFiles)])),
      filter(
        or([
          callProp("isDirectory"),
          pipe([get("name"), callProp("endsWith", includePattern)]),
        ])
      ),
      flatMap(
        pipe([
          switchCase([
            callProp("isDirectory"),
            ({ name }) =>
              pipe([
                () => Path.resolve(directory, name),
                walkDirectory({
                  includePattern,
                  onFile,
                  pathsNested: [...pathsNested, name],
                }),
              ])(),
            pipe([
              (dirent) => ({ dirent, pathsNested }),
              onFile,
              (result) => [result],
            ]),
          ]),
        ])
      ),
    ])();

const findConfig = ({ dirent, packageJson }) => {
  let _content;
  let _packageJson;
  return pipe([
    () => ["config.js", "primary/config.js"],
    any(
      tryCatch(
        pipe([
          (file) => Path.resolve(dirent.path, file),
          (configPath) => import(configPath),
          get("default"),
          (fn) => fn({}),
          get("includeGroups"),
          tap.if(isEmpty, () => {
            console.error("no includeGroups for ", dirent.path);
          }),
          reduce(
            (acc, group) =>
              pipe([
                () => GROUPS,
                find(eq(first, group)),
                last,
                switchCase([
                  isEmpty,
                  pipe([
                    tap(() => {
                      console.log("cannot find ", group, "in", dirent.path);
                    }),
                    () => acc,
                  ]),
                  pipe([
                    prepend("@aws-sdk/client-"),
                    (pkg) =>
                      pipe([
                        () => acc,
                        set(pkg, "3.332.0"),
                        tap((params) => {
                          assert(params);
                        }),
                      ])(),
                  ]),
                ]),
              ])(),
            {}
          ),
          (dependencies) => ({
            ...packageJson,
            dependencies: { ...dependencies, ...packageJson.dependencies },
          }),
          tap((params) => {
            assert(params);
          }),
          (c) => JSON.stringify(c, null, 2),
          append("\n"),
          (newPackageJson) =>
            pipe([
              () => Path.resolve(dirent.path, "package.json"),
              tap((file) => {
                console.log(file);
              }),
              tryCatch(
                (file) => fs.writeFile(file, newPackageJson),
                (error) => {
                  console.error(error);
                }
              ),
            ])(),
          tap((newPackageJson) => {
            _content = newPackageJson;
          }),
        ]),
        (_error, _file) => {
          return false;
        }
      )
    ),
    () => _content,
  ])();
};

const onFile = ({ dirent, pathsNested }) =>
  pipe([
    tap((params) => {
      assert(pathsNested);
    }),
    () => Path.resolve(dirent.path, dirent.name),
    (path) =>
      pipe([
        () => fs.readFile(path, "utf-8"),
        JSON.parse,
        (packageJson) => ({ dirent, packageJson }),
        findConfig,
        tap((params) => {
          assert(true);
        }),
        tap.if(isEmpty, () => {
          //  console.log("no config for ", path);
        }),
        () => path,
      ])(),
  ])();

tryCatch(
  pipe([
    () => "../../../examples/aws/",
    tap((params) => {
      assert(true);
    }),
    walkDirectory({ onFile }),
    callProp("join", "\n"),
    tap((params) => {
      // console.log(params);
    }),
  ]),
  (error) => {
    console.error(error);
    process.exit(1);
  }
)();
