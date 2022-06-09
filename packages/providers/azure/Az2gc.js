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
  assign,
} = require("rubico");
const { find, callProp, when, includes } = require("rubico/x");
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

const replaceLocation = (providerConfig) =>
  pipe([
    tap((params) => {
      assert(providerConfig);
    }),
    when(
      get("location"),
      assign({
        location: ({ location }) =>
          pipe([
            () => location,
            // "UK West" => "ukwest"
            callProp("toLowerCase"),
            callProp("replaceAll", " ", ""),
            when(
              includes(providerConfig.location),
              pipe([
                callProp(
                  "replaceAll",
                  providerConfig.location,
                  "config.location"
                ),
                (resource) => () => resource,
              ])
            ),
          ])(),
      })
    ),
  ]);

const azFilterModel = ({ providerConfig }) =>
  pipe([
    tap((params) => {
      assert(true);
    }),
    filterModel({ field: "tags" }),
    tap((params) => {
      assert(true);
    }),
    map(assign({ live: pipe([get("live"), replaceLocation(providerConfig)]) })),
    tap((params) => {
      assert(true);
    }),
  ]);

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
        filterModel: azFilterModel({ providerConfig }),
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
