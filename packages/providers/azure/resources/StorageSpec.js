const assert = require("assert");
const fs = require("fs").promises;
const path = require("path");
const {
  pipe,
  assign,
  get,
  tap,
  map,
  pick,
  fork,
  switchCase,
} = require("rubico");
const { defaultsDeep, callProp, flatten, prepend } = require("rubico/x");

const { md5FileBase64, omitIfEmpty } = require("@grucloud/core/Common");
const {
  getSharedAccessKeys,
  createContainerClient,
  getBlobServiceProperties,
  getBlobsByContainer,
  getContainerClient,
  getContainerName,
  setBlobServiceProperties,
  upsertBlob,
  getBlobName,
  upsert,
} = require("./StorageUtils");

const { findDependenciesResourceGroup } = require("../AzureCommon");

const group = "Storage";

exports.fnSpecs = ({ config }) =>
  pipe([
    () => [
      {
        type: "BlobServiceProperties",
        dependencies: {
          resourceGroup: {
            type: "ResourceGroup",
            group: "Resources",
            name: "resourceGroupName",
            parent: true,
          },
          account: {
            type: "StorageAccount",
            group: "Storage",
            name: "accountName",
            parent: true,
          },
        },
        propertiesDefault: {
          properties: {
            staticWebsite: {
              enabled: false,
              indexDocument: undefined,
              defaultIndexDocumentPath: undefined,
              errorDocument404Path: undefined,
            },
            cors: [],
            deleteRetentionPolicy: {
              enabled: false,
              AllowPermanentDelete: "false",
              days: undefined,
            },
          },
        },
        //TODO
        pickPropertiesCreate: ["properties"],
        filterLive: ({ pickPropertiesCreate }) =>
          pipe([pick(pickPropertiesCreate)]),
        Client: ({ spec, config }) =>
          pipe([
            () => ({
              spec,
              findId: pipe([get("live.id")]),
              findName: pipe([get("live.storageAccountName")]),
              cannotBeDeleted: () => true,
              findDependencies: ({ live, lives }) => [
                findDependenciesResourceGroup({ live, lives, config }),
                {
                  type: "StorageAccount",
                  group: "Storage",
                  ids: [pipe([() => live, get("id")])()],
                },
              ],
              create: upsert({ config }),
              update: upsert({ config }),
              getByName: ({ lives, name }) =>
                pipe([
                  () =>
                    lives.getByName({
                      name,
                      type: "StorageAccount",
                      group: "Storage",
                      providerName: config.providerName,
                    }),
                  tap((storageAccount) => {
                    assert(storageAccount);
                  }),
                  getBlobServiceProperties,
                ])(),
              getList: ({ lives }) =>
                pipe([
                  () =>
                    lives.getByType({
                      type: "StorageAccount",
                      group: "Storage",
                      providerName: config.providerName,
                    }),
                  map.pool(10, getBlobServiceProperties),
                ])(),
            }),
          ])(),
      },
      {
        type: "Blob",
        dependencies: {
          resourceGroup: {
            type: "ResourceGroup",
            group: "Resources",
            name: "resourceGroupName",
            parent: true,
          },
          account: {
            type: "StorageAccount",
            group: "Storage",
            parent: true,
          },
          container: {
            type: "BlobContainer",
            group: "Storage",
            parent: true,
          },
        },
        //TODO remove
        propertiesDefault: {
          properties: { serverEncrypted: true, accessTier: "Hot" },
        },
        pickPropertiesCreate: [
          "name",
          "properties.contentType",
          "properties.contentEncoding",
          "properties.contentLanguage",
        ],
        compare: pipe([
          tap((params) => {
            assert(true);
          }),
          fork({
            targetMd5: ({ target, programOptions }) =>
              pipe([
                tap(() => {
                  assert(target);
                  assert(programOptions);
                }),
                () => target,
                get("source"),
                (source) =>
                  path.resolve(programOptions.workingDirectory, source),
                md5FileBase64,
              ])(),
            liveMd5: pipe([
              get("live.properties.contentMD5"),
              (contentMD5) =>
                new Buffer.from(contentMD5, "hex").toString("base64"),
            ]),
          }),
          switchCase([
            ({ targetMd5, liveMd5 }) => targetMd5 != liveMd5,
            ({ targetMd5, liveMd5 }) => ({
              liveDiff: { updated: { md5: liveMd5 } },
              targetDiff: { updated: { md5: targetMd5 } },
            }),
            () => ({}),
          ]),
        ]),
        filterLive: ({ pickPropertiesCreate }) =>
          pipe([
            tap((params) => {
              assert(pickPropertiesCreate);
            }),
            pick(pickPropertiesCreate),
            omitIfEmpty([
              "properties.contentEncoding",
              "properties.contentLanguage",
            ]),
            assign({
              source: pipe([get("name"), prepend("assets/")]),
            }),
          ]),
        Client: ({ spec, config }) =>
          pipe([
            () => ({
              spec,
              findId: pipe([
                get("live.id"),
                tap((id) => {
                  assert(id);
                }),
              ]),
              findName: pipe([
                get("live"),
                ({ name, containerName }) => `${containerName}::${name}`,
              ]),
              findDependencies: ({ live, lives }) => [
                findDependenciesResourceGroup({ live, lives, config }),
                // {
                //   type: "StorageAccount",
                //   group: "Storage",
                //   ids: [pipe([() => live, get("id")])()],
                // },
                {
                  type: "BlobContainer",
                  group: "Storage",
                  ids: [
                    pipe([
                      () => live,
                      get("id"),
                      callProp("split", "/"),
                      callProp("slice", 0, -1),
                      callProp("join", "/"),
                    ])(),
                  ],
                },
              ],
              create: upsertBlob({ config }),
              update: upsertBlob({ config }),
              destroy: ({ name, lives }) =>
                pipe([
                  getContainerClient({ name, config, lives }),
                  tap((params) => {
                    assert(true);
                  }),
                  callProp("deleteBlob", getBlobName(name)),
                ])(),
              getByName: ({ lives, name }) =>
                pipe([
                  tap(() => {
                    assert(name);
                  }),
                  () => name,
                  callProp("split", "::"),
                  callProp("slice", 0, -2),
                  callProp("join", "::"),
                  (name) =>
                    lives.getByName({
                      name,
                      type: "StorageAccount",
                      group: "Storage",
                      providerName: config.providerName,
                    }),
                  tap((storageAccount) => {
                    assert(storageAccount);
                  }),
                  (storageAccount) =>
                    pipe([
                      () => storageAccount,
                      get("live"),
                      createContainerClient({
                        containerName: getContainerName(name),
                      }),
                      callProp("getBlobClient", getBlobName(name)),
                      callProp("getProperties"),
                      (properties) => ({
                        id: `${storageAccount.id}/${getContainerName(
                          name
                        )}/${getBlobName(name)}`,
                        name,
                        properties,
                      }),
                    ])(),
                ])(),
              getList: ({ lives }) =>
                pipe([
                  () =>
                    lives.getByType({
                      type: "BlobContainer",
                      group: "Storage",
                      providerName: config.providerName,
                    }),
                  map.pool(10, getBlobsByContainer({ config, lives })),
                  flatten,
                ])(),
            }),
          ])(),
      },
      {
        type: "StorageAccount",
        decorate: ({ axios, lives }) =>
          pipe([
            assign({
              sharedAccessKeys: getSharedAccessKeys({ axios, config }),
            }),
          ]),
      },
      {
        type: "BlobContainer",
      },
    ],
    map(defaultsDeep({ group })),
  ])();
