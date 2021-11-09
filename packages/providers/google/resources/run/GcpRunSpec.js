const assert = require("assert");
const { pipe, assign, map, tap, omit } = require("rubico");
const { compare } = require("../../GoogleCommon");

const { GcpRunService } = require("./GcpRunService");

const GROUP = "run";

module.exports = () =>
  map(assign({ group: () => GROUP }))([
    {
      type: "Service",
      Client: GcpRunService,
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
          omit([
            ["metadata", "annotations", "serving.knative.dev/lastModifier"],
          ]),
          omit([["metadata", "annotations", "serving.knative.dev/creator"]]),
          omit([
            ["metadata", "annotations", "run.googleapis.com/ingress-status"],
          ]),
          omit(["status"]),
        ]),
      compare: compare({
        filterTarget: pipe([
          tap((params) => {
            assert(true);
          }),
        ]),
        filterLive: pipe([
          tap((params) => {
            assert(true);
          }),
          omit(["status"]),
        ]),
      }),
    },
  ]);
