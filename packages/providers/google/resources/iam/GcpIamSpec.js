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

module.exports = (config) => [
  {
    type: "ServiceAccount",
    Client: ({ spec }) =>
      GcpServiceAccount({
        spec,
        config,
      }),
    isOurMinion: isOurMinionServiceAccount,
  },
  {
    type: "IamPolicy",
    singleton: true,
    Client: ({ spec }) =>
      GcpIamPolicy({
        spec,
        config,
      }),
    isOurMinion: () => true,
    compare: compareIamPolicy,
  },
  {
    type: "IamBinding",
    Client: ({ spec }) =>
      GcpIamBinding({
        spec,
        config,
      }),
    isOurMinion: isOurMinionIamBinding,
    compare: compareIamBinding,
  },
];
