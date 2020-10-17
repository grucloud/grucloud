const { compareArray } = require("../../../../Utils");
const { tos } = require("../../../../tos");

const {
  GcpServiceAccount,
  isOurMinionServiceAccount,
} = require("./GcpServiceAccount");

const { GcpIamPolicy } = require("./GcpIamPolicy");
const { GcpIamBinding, isOurMinionIamBinding } = require("./GcpIamBinding");

const logger = require("../../../../logger")({ prefix: "GcpIamSpec" });

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
    compare: ({ target, live }) => {
      logger.debug(`compare policy`);
      const diff = compareArray({
        targets: target.policy.bindings,
        lives: live.bindings,
      });
      logger.debug(`compare ${tos(diff)}`);
      return diff;
    },
  },
  {
    type: "IamBinding",
    Client: ({ spec }) =>
      GcpIamBinding({
        spec,
        config,
      }),
    isOurMinion: isOurMinionIamBinding,
    compare: ({ target, live }) => {
      logger.debug(`compare binding`);
      const diff = compareArray({
        targets: target.members,
        lives: live.members,
      });
      logger.debug(`compare ${tos(diff)}`);
      return diff;
    },
  },
];
