const assert = require("assert");
const path = require("path");
const {
  pipe,
  tap,
  get,
  map,
  omit,
  switchCase,
  tryCatch,
  not,
  filter,
  assign,
  any,
  fork,
  or,
} = require("rubico");
const {
  includes,
  first,
  forEach,
  callProp,
  isEmpty,
  pluck,
  groupBy,
  values,
  keys,
} = require("rubico/x");
const prettier = require("prettier");
const { camelCase } = require("change-case");
const fs = require("fs").promises;

const createPrefixes = ["Create", "Put", "Request"];
const deletePrefixes = ["Delete", "Remove"];
const getOnePrefixes = ["Describe", "Get"];
const listPrefixes = ["List"];
const operationsExcludes = [
  "ListTagsForResource",
  "ActivateEventSource",
  "ListPartnerEventSourceAccounts",
  "PartnerEventSource",
  "PartnerEvent",
  "PutEvents",
  "Replay",
  "Permission",
];

const readInput = ({ input }) =>
  pipe([
    tap((params) => {
      assert(true);
    }),
    () => fs.readFile(input, "utf-8"),
    JSON.parse,
    tap((result) => {
      console.log(result.metadata);
    }),
  ])();

const operationsExclude = pipe([
  tap((params) => {
    assert(true);
  }),
  filter(({ name }) =>
    pipe([
      tap((params) => {
        assert(true);
      }),
      () => operationsExcludes,
      tap((params) => {
        assert(true);
      }),
      not(
        any(
          or([
            (opExclude) => name.endsWith(opExclude),
            (opExclude) => name.endsWith(`${opExclude}s`),
          ])
        )
      ),
      tap((params) => {
        assert(true);
      }),

      tap((params) => {
        assert(true);
      }),
    ])()
  ),
  tap((params) => {
    assert(true);
  }),
]);
const findOperationType =
  ({ prefixes }) =>
  (operations) =>
    pipe([
      tap((params) => {
        assert(true);
      }),
      () => operations,
      operationsExclude,
      keys,
      filter((operation) =>
        pipe([() => operationsExcludes, not(includes(operation))])()
      ),
      tap((params) => {
        assert(true);
      }),
      filter((name) =>
        pipe([() => prefixes, any((prefix) => name.startsWith(prefix))])()
      ),
      tap((params) => {
        assert(true);
      }),
    ])();

const findResources = ({ operations }) =>
  pipe([
    tap((params) => {
      assert(operations);
    }),
    () => operations,
    fork({
      create: findOperationType({ prefixes: createPrefixes }),
      destroy: findOperationType({ prefixes: deletePrefixes }),
      getOne: findOperationType({ prefixes: getOnePrefixes }),
      list: findOperationType({ prefixes: listPrefixes }),
    }),
    tap((params) => {
      assert(true);
    }),
  ])();

exports.main = (options) =>
  pipe([
    tap((params) => {
      assert(true);
      console.log(options);
    }),
    () => options,
    readInput,
    tap((params) => {
      assert(true);
    }),
    assign({ resources: findResources }),
    tap((params) => {
      assert(true);
    }),
  ])();
