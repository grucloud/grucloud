const assert = require("assert");
const path = require("path");
const fs = require("fs").promises;
const { camelCase } = require("change-case");

const {
  pipe,
  tap,
  get,
  eq,
  map,
  flatMap,
  fork,
  switchCase,
  filter,
  and,
  tryCatch,
  not,
  assign,
} = require("rubico");

const {
  first,
  find,
  callProp,
  pluck,
  identity,
  values,
  flatten,
  size,
  defaultsDeep,
  isFunction,
} = require("rubico/x");

exports.writeOutput = ({ options, content }) =>
  pipe([
    () => fs.writeFile(options.output, content),
    tap(() => {
      console.log(`infrastructure written to ${options.output}`);
    }),
  ])();

exports.ResourceVarName = (name) => camelCase(name);

exports.findLiveById =
  ({ lives, type }) =>
  (id) =>
    pipe([
      tap(() => {
        assert(lives);
        assert(type);
        assert(id);
      }),
      () => lives,
      find(eq(get("type"), type)),
      get("resources"),
      find(eq(get("id"), id)),
      tap((xxx) => {
        //console.log(`findName`);
      }),
    ])();

exports.writeResources =
  ({ type, writeResource }) =>
  ({ lives, mapping }) =>
    pipe([
      tap(() => {
        assert(type);
        assert(isFunction(writeResource));
      }),
      () => lives,
      find(eq(get("type"), type)),
      get("resources"),
      map(
        pipe([
          tap((network) => {
            //console.log(`writeResources`);
          }),
          (resource) => writeResource({ resource, lives, mapping }),
        ])
      ),
    ])();

exports.readModel = (options) =>
  pipe([
    tap(() => {
      console.log(`readModel`, options);
    }),
    () => fs.readFile(path.resolve(options.input), "utf-8"),
    JSON.parse,
    tap((xxx) => {
      console.log("");
    }),
    get("result.results"),
    first,
    tap((xxx) => {
      console.log("");
    }),
    get("results"),
    tap((xxx) => {
      console.log("");
    }),
  ]);

exports.readMapping = (options) =>
  pipe([
    tap(() => {
      //console.log("readMapping", options.mapping);
    }),
    () => fs.readFile(path.resolve(options.mapping), "utf-8"),
    JSON.parse,
  ]);
