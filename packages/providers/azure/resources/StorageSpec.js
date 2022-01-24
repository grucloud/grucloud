const assert = require("assert");
const { pipe, assign, get, tap, map, pick, tryCatch } = require("rubico");
const { defaultsDeep, callProp } = require("rubico/x");
const {
  BlobServiceClient,
  StorageSharedKeyCredential,
} = require("@azure/storage-blob");

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

const setBlobServiceProperties =
  ({ payload }) =>
  ({ live }) =>
    pipe([
      tap(() => {
        assert(live);
        assert(payload);
      }),
      () => live,
      createBlobServiceClient,
      callProp("setProperties", payload.properties),
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
              create: ({ name, payload, resolvedDependencies, live, lives }) =>
                pipe([
                  tap((params) => {
                    assert(name);
                    assert(live);
                    assert(payload);
                    assert(resolvedDependencies);
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
              update: ({ name, payload, resolvedDependencies, live, lives }) =>
                pipe([
                  tap((params) => {
                    assert(name);
                    assert(live);
                    assert(payload);
                    assert(resolvedDependencies);
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
