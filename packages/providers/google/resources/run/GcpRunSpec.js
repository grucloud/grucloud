const assert = require("assert");
const { pipe, assign, map, tap, omit, set, get } = require("rubico");
const { omitIfEmpty } = require("@grucloud/core/Common");
const { compareGoogle } = require("../../GoogleCommon");

const { GcpRunService } = require("./GcpRunService");
const { GcpRunServiceIamMember } = require("./GcpRunServiceIamMember");

const GROUP = "run";

module.exports = () =>
  map(assign({ group: () => GROUP }))([
    {
      type: "Service",
      Client: GcpRunService,
      inferName: ({ properties, dependencies }) =>
        pipe([() => properties, get("metadata.name")])(),
      filterLive: () =>
        pipe([
          tap((params) => {
            assert(true);
          }),
          omit(["metadata.uid"]),
          omit(["metadata.namespace"]),
          omit(["metadata.selfLink"]),
          omit(["metadata.resourceVersion"]),
          omit(["metadata.creationTimestamp"]),
          omit(["metadata.deletionTimestamp"]),
          omit(["metadata.generation"]),
          omit(["metadata.annotations"]),
          omit([["metadata", "labels", "cloud.googleapis.com/location"]]),
          omit([
            [
              "spec",
              "template",
              "metadata",
              "annotations",
              "run.googleapis.com/client-name",
            ],
          ]),
          omit([
            [
              "spec",
              "template",
              "metadata",
              "annotations",
              "run.googleapis.com/execution-environment",
            ],
          ]),

          omit(["status"]),
          omitIfEmpty(["metadata.labels"]),
          set(
            "spec.template.spec.serviceAccountName",
            () =>
              "`${config.projectNumber()}-compute@developer.gserviceaccount.com`"
          ),
          tap((params) => {
            assert(true);
          }),
        ]),
      compare: compareGoogle({
        filterTarget: () =>
          pipe([
            tap((params) => {
              assert(true);
            }),
          ]),
        filterLive: () =>
          pipe([
            tap((params) => {
              assert(true);
            }),
            omit([
              "metadata.annotations",
              "policy.etag",
              "status",
              ["metadata", "labels", "cloud.googleapis.com/location"],
            ]),
          ]),
      }),
    },
    {
      type: "ServiceIamMember",
      Client: GcpRunServiceIamMember,
      dependencies: {
        service: { type: "Service", group: "run", parent: true },
      },
      inferName: ({ properties, dependencies }) =>
        pipe([
          dependencies,
          tap(({ service }) => {
            assert(service);
          }),
          ({ service }) => `${service.name}::${properties.location}`,
          tap((params) => {
            assert(true);
          }),
        ])(),
      filterLive: () =>
        pipe([
          tap((params) => {
            assert(true);
          }),
          omit(["policy.etag", "service"]),
          set("location", () => "config.region"),
          tap((params) => {
            assert(true);
          }),
        ]),
      compare: compareGoogle({
        filterLive: () => pipe([omit(["policy.etag"])]),
      }),
    },
  ]);
