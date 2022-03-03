const assert = require("assert");
const { pipe, assign, map, omit, tap, pick, get } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const AdmZip = require("adm-zip");
const path = require("path");

const { omitIfEmpty } = require("@grucloud/core/Common");
const { compareAws, isOurMinionObject } = require("../AwsCommon");

const { Function, compareFunction } = require("./Function");
const { Layer, compareLayer } = require("./Layer");
const { EventSourceMapping } = require("./EventSourceMapping");

const GROUP = "Lambda";

module.exports = () =>
  map(assign({ group: () => GROUP }))([
    {
      type: "Layer",
      Client: Layer,
      isOurMinion: ({ live, config }) =>
        isOurMinionObject({ tags: live.Tags, config }),
      compare: compareLayer,
      displayResource: () => pipe([omit(["Content.Data", "Content.ZipFile"])]),
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
            tap((params) => {
              assert(true);
            }),
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
    {
      type: "Function",
      Client: Function,
      isOurMinion: ({ live, config }) =>
        isOurMinionObject({ tags: live.Tags, config }),
      compare: compareFunction,
      displayResource: () => pipe([omit(["Code.Data", "Code.ZipFile"])]),
      //TODO
      pickProperties: [
        "Handler",
        "PackageType",
        "Runtime",
        "Description",
        "LicenseInfo",
        "Timeout",
        "MemorySize",
        "Environment",
        "CodeSha256",
      ],
      filterLive:
        ({ resource, programOptions }) =>
        (live) =>
          pipe([
            tap(() => {
              assert(resource.name);
              assert(live.Code.Data);
            }),
            () => live,
            get("Configuration"),
            pick([
              "Handler",
              "PackageType",
              "Runtime",
              "Description",
              "LicenseInfo",
              "Timeout",
              "MemorySize",
              "Environment",
            ]),
            tap(
              pipe([
                () => new AdmZip(Buffer.from(live.Code.Data, "base64")),
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
      dependencies: {
        layers: { type: "Layer", group: "Lambda", list: true },
        role: { type: "Role", group: "IAM" },
      },
    },
    {
      type: "EventSourceMapping",
      Client: EventSourceMapping,
      isOurMinion: ({ live, config }) =>
        isOurMinionObject({ tags: live.Tags, config }),
      compare: compareAws({
        filterTarget: () =>
          pipe([
            defaultsDeep({
              BatchSize: 10,
              MaximumBatchingWindowInSeconds: 0,
              FunctionResponseTypes: [],
            }),
            omit(["FunctionName", "Tags"]),
            omitIfEmpty(["FunctionResponseTypes"]),
          ]),
        filterLive: () =>
          pipe([
            omit([
              "UUID",
              "FunctionArn",
              "LastModified",
              "LastProcessingResult",
              "StateTransitionReason",
              "MaximumRecordAgeInSeconds",
              "Tags",
              "State",
            ]),
            omitIfEmpty([
              "StartingPosition",
              "StartingPositionTimestamp",
              "ParallelizationFactor",
              "BisectBatchOnFunctionError",
              "MaximumRetryAttempts",
              "TumblingWindowInSeconds",
              "FunctionResponseTypes",
            ]),
          ]),
      }),
      filterLive:
        ({ resource }) =>
        (live) =>
          pipe([
            tap(() => {}),
            () => live,
            pick([
              "StartingPosition",
              "StartingPositionTimestamp",
              "BatchSize",
              "MaximumBatchingWindowInSeconds",
              "ParallelizationFactor",
              "DestinationConfig",
              "Topics",
              "Queues",
              "MaximumRecordAgeInSeconds",
              "BisectBatchOnFunctionError",
              "MaximumRetryAttempts",
              "TumblingWindowInSeconds",
              "FunctionResponseTypes",
            ]),
            omitIfEmpty(["FunctionResponseTypes"]),
          ])(),
      dependencies: {
        lambdaFunction: { type: "Function", group: "Lambda", parent: true },
        sqsQueue: { type: "Queue", group: "SQS" },
        //TODO other event source
      },
    },
  ]);
