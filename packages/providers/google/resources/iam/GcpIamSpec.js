const assert = require("assert");
const { pipe, assign, map, tap, pick } = require("rubico");
const { prepend } = require("rubico/x");
const { tos } = require("@grucloud/core/tos");
const { camelCase } = require("change-case");
const { compare } = require("../../GoogleCommon");

const {
  GcpServiceAccount,
  isOurMinionServiceAccount,
} = require("./GcpServiceAccount");

const { GcpIamPolicy, compareIamPolicy } = require("./GcpIamPolicy");
const {
  GcpIamBinding,
  isOurMinionIamBinding,
  compareIamBinding,
} = require("./GcpIamBinding");

const logger = require("@grucloud/core/logger")({ prefix: "GcpIamSpec" });

const GROUP = "iam";

module.exports = () =>
  map(assign({ group: () => GROUP }))([
    {
      type: "ServiceAccount",
      Client: GcpServiceAccount,
      isOurMinion: isOurMinionServiceAccount,
      resourceVarName: pipe([prepend("sa_"), camelCase]),
      filterLive: () =>
        pipe([
          ({ description, displayName }) => ({
            serviceAccount: { displayName, description },
          }),
        ]),
      compare: compare({
        filterTarget: pipe([
          tap(({ serviceAccount }) => {
            assert(true);
          }),
          ({ serviceAccount }) => serviceAccount,
        ]),
        filterLive: pipe([
          tap((params) => {
            assert(true);
          }),
          pick(["displayName", "description"]),
        ]),
      }),
    },
    {
      type: "Policy",
      singleton: true,
      Client: GcpIamPolicy,
      isOurMinion: () => true,
      compare: compareIamPolicy,
      filterLive: () => pipe([pick(["bindings"])]),
    },
    {
      type: "Binding",
      Client: GcpIamBinding,
      isOurMinion: isOurMinionIamBinding,
      compare: compareIamBinding,
    },
  ]);
