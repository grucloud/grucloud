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
  tryCatch,
  fork,
  switchCase,
} = require("rubico");
const { defaultsDeep, callProp, flatten, last, prepend } = require("rubico/x");
const {
  BlobServiceClient,
  ContainerClient,
  StorageSharedKeyCredential,
} = require("@azure/storage-blob");

//const mime = require("mime-types");

const { md5FileBase64, omitIfEmpty } = require("@grucloud/core/Common");

const { findDependenciesResourceGroup } = require("../AzureCommon");

const group = "Storage";

const getSharedAccessKeys =
  ({ axios }) =>
  (account) =>
    pipe([
      tap(() => {
        assert(account);
        assert(axios);
      }),
      tryCatch(
        pipe([
          () => axios.post(`${account.id}/listKeys?api-version=2021-04-01`),
          get("data.keys"),
          tap((keys) => {
            assert(keys);
          }),
        ]),
        (error) =>
          pipe([
            tap((params) => {
              assert(true);
            }),
            () => error,
          ])()
      ),
    ])();

const createBlobServiceClient = ({ name, sharedAccessKeys }) =>
  pipe([
    tap(() => {
      assert(name);
      assert(sharedAccessKeys);
    }),
    () => new StorageSharedKeyCredential(name, sharedAccessKeys[0].value),
    (sharedKeyCredential) =>
      new BlobServiceClient(
        `https://${name}.blob.core.windows.net`,
        sharedKeyCredential
      ),
  ])();

const createContainerClient =
  ({ containerName }) =>
  ({ name, sharedAccessKeys }) =>
    pipe([
      tap(() => {
        assert(containerName);
        assert(name);
        assert(Array.isArray(sharedAccessKeys));
      }),
      () => new StorageSharedKeyCredential(name, sharedAccessKeys[0].value),
      (sharedKeyCredential) =>
        new ContainerClient(
          `https://${name}.blob.core.windows.net/${containerName}`,
          sharedKeyCredential
        ),
    ])();

const getBlobServiceProperties = ({ live, name }) =>
  pipe([
    tap(() => {
      assert(live);
      assert(live.name);
      assert(name);
    }),
    () => live,
    createBlobServiceClient,
    callProp("getProperties"),
    tap((props) => {
      assert(props);
    }),
    //TODO more?
    pick(["staticWebsite", "cors", "deleteRetentionPolicy"]),
    (properties) => ({
      name: live.name,
      storageAccountName: name,
      id: live.id,
      properties,
    }),
  ])();

const storageAccountNameFromId = pipe([
  get("id"),
  callProp("split", "/"),
  (ids) => `${ids[4]}::${ids[8]}`,
  tap((params) => {
    assert(true);
  }),
]);

const getBlobsByContainer =
  ({ config, lives }) =>
  ({ live, name }) =>
    pipe([
      tap(() => {
        assert(live);
        assert(config);
        assert(lives);
      }),
      //TODO ude storageAccountName ?
      () => live,
      storageAccountNameFromId,
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
      get("live"),
      createContainerClient({ containerName: live.name }),
      callProp("listBlobsFlat"),
      async (blobsIt) => {
        //TODO it is ugly
        let blobs = [];
        for await (const blob of blobsIt) {
          blobs.push({
            containerName: name,
            id: `${live.id}/${blob.name}`,
            ...blob,
          });
        }
        return blobs;
      },
      tap((params) => {
        assert(true);
      }),
    ])();

const getStorageAccountName = pipe([
  callProp("split", "::"),
  callProp("slice", 0, 2),
  callProp("join", "::"),
]);

const getContainerName = pipe([
  callProp("split", "::"),
  (arr) => arr[2],
  tap((containerName) => {
    assert(containerName);
  }),
]);

const getBlobName = pipe([callProp("split", "::"), last]);

const getContainerClient = ({ name, config, lives }) =>
  pipe([
    tap((params) => {
      assert(name);
      assert(config);
      assert(lives);
    }),
    () => name,
    getStorageAccountName,
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
    get("live"),
    createContainerClient({
      containerName: getContainerName(name),
    }),
  ]);

const setBlobServiceProperties =
  ({ payload }) =>
  ({ live }) =>
    pipe([
      tap(() => {
        assert(live);
        assert(payload);
        assert(payload.properties);
      }),
      () => live,
      createBlobServiceClient,
      callProp("setProperties", payload.properties),
    ])();

const upsertBlob =
  ({ config }) =>
  ({ name, payload, lives, programOptions }) =>
    pipe([
      tap((params) => {
        assert(name);
        assert(payload);
        assert(payload.source);
        assert(payload.properties.contentType);
        assert(lives);
        assert(programOptions);
      }),
      fork({
        containerClient: getContainerClient({
          name,
          config,
          lives,
        }),
        blobName: () => getBlobName(name),
        buffer: pipe([
          () => path.resolve(programOptions.workingDirectory, payload.source),
          fs.readFile,
        ]),
        blobHTTPHeaders: () => ({
          /*blobCacheControl: "blobCacheControl",
      blobContentDisposition: "blobContentDisposition",
      blobContentEncoding: "blobContentEncoding",
      blobContentLanguage: "blobContentLanguage",
      */
          blobContentType: payload.properties.contentType,
        }),
      }),
      ({ containerClient, blobName, buffer, blobHTTPHeaders }) =>
        containerClient.uploadBlockBlob(blobName, buffer, buffer.length, {
          blobHTTPHeaders,
          //metadata: {},
        }),
    ])();

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
        pickProperties: ["properties"],
        pickPropertiesCreate: ["properties"],
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
              //TODO merge create and update
              create: ({ name, payload, lives }) =>
                pipe([
                  tap((params) => {
                    assert(name);
                    assert(payload);
                    assert(lives);
                  }),
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
                  setBlobServiceProperties({ payload }),
                ])(),
              update: ({ name, payload, lives }) =>
                pipe([
                  tap((params) => {
                    assert(name);
                    assert(payload);
                    assert(lives);
                  }),
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
                  setBlobServiceProperties({ payload }),
                ])(),
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
        propertiesDefault: {
          properties: { serverEncrypted: true, accessTier: "Hot" },
        },
        pickProperties: [
          "properties.contentType",
          "properties.contentEncoding",
          "properties.contentLanguage",
        ],
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
        inferName: ({ properties, dependencies }) =>
          pipe([
            tap((params) => {
              assert(dependencies);
              assert(properties);
              assert(properties.name);
            }),
            dependencies,
            tap(({ container }) => {
              assert(container);
            }),
            ({ container }) => `${container.name}::${properties.name}`,
            tap((params) => {
              assert(true);
            }),
          ])(),
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
                      tap((params) => {
                        assert(true);
                      }),
                      () => storageAccount,
                      get("live"),
                      createContainerClient({
                        containerName: getContainerName(name),
                      }),
                      callProp("getBlobClient", getBlobName(name)),
                      tap((params) => {
                        assert(true);
                      }),
                      callProp("getProperties"),
                      tap((params) => {
                        assert(true);
                      }),
                      (properties) => ({
                        id: `${storageAccount.id}/${getContainerName(
                          name
                        )}/${getBlobName(name)}`,
                        name,
                        properties,
                      }),
                      tap((params) => {
                        assert(true);
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
