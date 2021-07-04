const { pipe, assign, map } = require("rubico");
const { tos } = require("@grucloud/core/tos");

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
    },
    {
      type: "Policy",
      singleton: true,
      Client: GcpIamPolicy,
      isOurMinion: () => true,
      compare: compareIamPolicy,
    },
    {
      type: "Binding",
      Client: GcpIamBinding,
      isOurMinion: isOurMinionIamBinding,
      compare: compareIamBinding,
    },
  ]);
