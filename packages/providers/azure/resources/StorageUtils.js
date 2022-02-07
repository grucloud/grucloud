const assert = require("assert");
const fsSync = require("fs");

const fs = require("fs").promises;
const path = require("path");
const { pipe, get, tap, map, pick, tryCatch, fork } = require("rubico");
const { callProp, last } = require("rubico/x");
const {
  BlobServiceClient,
  ContainerClient,
  StorageSharedKeyCredential,
} = require("@azure/storage-blob");

const getStorageAccountName = pipe([
  callProp("split", "::"),
  callProp("slice", 0, 2),
  callProp("join", "::"),
]);
exports.getStorageAccountName = getStorageAccountName;

const getContainerName = (fullName) =>
  pipe([
    () => fullName,
    callProp("split", "::"),
    (arr) => arr[2],
    tap((containerName) => {
      assert(containerName);
    }),
  ])();

exports.getContainerName = getContainerName;

const getBlobName = pipe([callProp("split", "::"), last]);
exports.getBlobName = getBlobName;

const storageAccountNameFromId = pipe([
  get("id"),
  callProp("split", "/"),
  (ids) => `${ids[4]}::${ids[8]}`,
  tap((params) => {
    assert(true);
  }),
]);

exports.getSharedAccessKeys =
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

exports.createContainerClient = createContainerClient;

exports.getBlobServiceProperties = ({ live, name }) =>
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

exports.getBlobsByContainer =
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

exports.getContainerClient = getContainerClient;

exports.setBlobServiceProperties =
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

exports.upsertBlob =
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

exports.readStreamToLocalFileWithLogs = async ({ readStream, fileName }) =>
  new Promise((resolve, reject) => {
    assert(readStream);
    assert(fileName);
    const writeStream = fsSync.createWriteStream(fileName);
    let error;
    readStream.on("error", (err) => {
      if (!error) {
        error = err;
      }
      readStream.emit("end");
    });

    writeStream.on("error", (err) => {
      if (!error) {
        error = err;
      }
    });
    writeStream.on("close", () => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });

    readStream.pipe(writeStream);
  });
