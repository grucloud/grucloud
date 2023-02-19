const assert = require("assert");
const { pipe, map, omit, tap, pick, get, fork } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { createAwsService } = require("../AwsService");

const AdmZip = require("adm-zip");
const path = require("path");
const os = require("os");

const { compareAws } = require("../AwsCommon");

const { LambdaFunction } = require("./Function");

const { LambdaAlias } = require("./LambdaAlias");

const { Layer, compareLayer } = require("./Layer");
const { LambdaPermission } = require("./LambdaPermission");

const { LambdaEventSourceMapping } = require("./LambdaEventSourceMapping");

const logger = require("@grucloud/core/logger")({ prefix: "Lambda" });

const GROUP = "Lambda";
const compare = compareAws({});

const createTempDir = () => os.tmpdir();

module.exports = pipe([
  () => [
    createAwsService(LambdaAlias({})),
    {
      type: "Layer",
      Client: Layer,
      inferName: () => get("LayerName"),
      compare: compareLayer,
      displayResource: () =>
        pipe([
          tap((params) => {
            assert(true);
          }),
          //TODO check
          omit(["Content.Data", "Content.ZipFile"]),
        ]),
      filterLive:
        ({ resource, programOptions }) =>
        (live) =>
          pipe([
            tap(() => {
              assert(resource.name);
              assert(live.Content.Data);
            }),
            () => live,
            pick([
              "LayerName",
              "Description",
              "CompatibleRuntimes",
              "LicenseInfo",
            ]),
            tap(
              pipe([
                fork({
                  zip: () =>
                    new AdmZip(Buffer.from(live.Content.Data, "base64")),
                  zipFile: () =>
                    path.resolve(createTempDir(), `${resource.name}.zip`),
                }),
                tap(({ zipFile }) => {
                  logger.debug(`zip written to`, zipFile);
                }),
                ({ zip, zipFile }) => zip.writeZip(zipFile),
              ])
            ),
            tap(
              pipe([
                () => new AdmZip(Buffer.from(live.Content.Data, "base64")),
                (zip) =>
                  zip.extractAllTo(
                    path.resolve(
                      programOptions.workingDirectory,
                      resource.name
                    ),
                    true
                  ),
              ])
            ),
          ])(),
    },
    createAwsService(LambdaEventSourceMapping({ compare })),
    createAwsService(LambdaFunction({})),
    createAwsService(LambdaPermission({})),
  ],
  map(
    defaultsDeep({
      group: GROUP,
      compare: compare({}),
    })
  ),
]);
