const assert = require("assert");

const GoogleTag = require("../../GoogleTag");
const logger = require("../../../../logger")({ prefix: "GcpDnsSpec" });

const {
  GcpDnsManagedZone,
  compareDnsManagedZone,
} = require("./GcpDnsManagedZone");

module.exports = (config) => [
  {
    type: "DnsManagedZone",
    Client: ({ spec }) =>
      GcpDnsManagedZone({
        spec,
        config,
      }),
    isOurMinion: ({ resource }) => GoogleTag.isOurMinion({ resource, config }),
    compare: compareDnsManagedZone,
  },
];
