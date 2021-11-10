const assert = require("assert");
const { pipe, assign, map, tap, omit, set, get } = require("rubico");
const { compare } = require("../../GoogleCommon");

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
          omit(["status"]),
          set(
            "spec.template.spec.serviceAccountName",
            () =>
              "`${config.projectNumber()}-compute@developer.gserviceaccount.com`"
          ),
          tap((params) => {
            assert(true);
          }),
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
          omit(["metadata.annotations"]),
          omit(["status"]),
        ]),
      }),
    },
    {
      type: "ServiceIamMember",
      Client: GcpRunServiceIamMember,
      dependsOn: ["run::Service"],
      inferName: ({ properties, dependencies }) =>
        pipe([
          () => properties,
          ({ service, location }) => `${service}::${location}`,
          tap((params) => {
            assert(true);
          }),
        ])(),
      filterLive: () =>
        pipe([
          tap((params) => {
            assert(true);
          }),
          omit(["policy.etag"]),
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
          omit(["policy.etag"]),
        ]),
      }),
    },
  ]);
