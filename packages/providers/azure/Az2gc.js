const assert = require("assert");
const { pipe, tap, get, eq, and, map, fork, filter } = require("rubico");
const { find, callProp } = require("rubico/x");
const path = require("path");

const {
  readModel,
  generatorMain,
  createWritersSpec,
  filterModel,
} = require("@grucloud/core/generatorUtils");
const { configTpl } = require("./configTpl");

const {
  getStorageAccountName,
  createContainerClient,
  getContainerName,
  getBlobName,
  readStreamToLocalFileWithLogs,
} = require("./resources/StorageUtils");

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

const downloadAssets = ({ specs, commandOptions, programOptions }) =>
  pipe([
    tap((params) => {
      assert(specs);
    }),
    fork({
      lives: readModel({
        writersSpec: createWritersSpec(specs),
        commandOptions,
        programOptions,
      }),
    }),
    tap((params) => {
      assert(true);
    }),
    ({ lives }) =>
      pipe([() => downloadBlobs({ lives, commandOptions, programOptions })])(),
  ])();

exports.generateCode = ({
  specs,
  providers,
  providerName,
  providerConfig,
  commandOptions,
  programOptions,
}) =>
  pipe([
    tap(() => {
      assert(specs);
      assert(providerName);
    }),
    () =>
      generatorMain({
        providers,
        name: "az2gc",
        providerConfig,
        providerType: "azure",
        providerName,
        specs,
        commandOptions,
        programOptions,
        configTpl,
        filterModel: filterModel({ field: "tags" }),
      }),
    () =>
      downloadAssets({
        specs,
        commandOptions,
        programOptions,
      }),
    tap((params) => {
      assert(true);
    }),
  ])();
