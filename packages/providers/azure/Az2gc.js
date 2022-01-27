const assert = require("assert");
const {
  pipe,
  tap,
  get,
  eq,
  and,
  map,
  fork,
  filter,
  not,
  assign,
} = require("rubico");
const {
  groupBy,
  values,
  find,
  callProp,
  unless,
  isEmpty,
} = require("rubico/x");
const path = require("path");

const { omitIfEmpty } = require("@grucloud/core/Common");
const { readModel, generatorMain } = require("@grucloud/core/generatorUtils");
const { configTpl } = require("./configTpl");

const {
  getStorageAccountName,
  createContainerClient,
  getContainerName,
  getBlobName,
  readStreamToLocalFileWithLogs,
} = require("./resources/StorageUtils");

// TODO
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

const downloadBlobs = ({ lives, commandOptions, programOptions }) =>
  pipe([
    () => lives,
    filter(eq(get("groupType"), "Storage::Blob")),
    map(({ name }) =>
      pipe([
        () => name,
        getStorageAccountName,
        (storageAccountName) =>
          pipe([
            () => lives,
            find(
              and([
                eq(get("groupType"), "Storage::StorageAccount"),
                eq(get("name"), storageAccountName),
              ])
            ),
            get("live"),
            createContainerClient({
              containerName: getContainerName(name),
            }),
            callProp("getBlobClient", getBlobName(name)),
            callProp("download", 0, undefined),
            (handle) =>
              readStreamToLocalFileWithLogs({
                readStream: handle.readableStreamBody,
                fileName: path.resolve(
                  programOptions.workingDirectory,
                  "assets",
                  getBlobName(name)
                ),
              }),
          ])(),
      ])()
    ),
  ])();

const downloadAssets = ({ writersSpec, commandOptions, programOptions }) =>
  pipe([
    tap((params) => {
      assert(writersSpec);
    }),
    fork({
      lives: readModel({ writersSpec, commandOptions, programOptions }),
    }),
    tap((params) => {
      assert(true);
    }),
    ({ lives }) =>
      pipe([() => downloadBlobs({ lives, commandOptions, programOptions })])(),
  ])();

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
    map.entries(([group, value]) => [group, { group, types: value }]),
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
        tap((params) => {
          assert(true);
        }),
        () =>
          downloadAssets({
            writersSpec,
            commandOptions,
            programOptions,
          }),
        tap((params) => {
          assert(true);
        }),
      ])(),
  ])();
