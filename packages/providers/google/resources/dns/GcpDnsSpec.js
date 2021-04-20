const assert = require("assert");

const GoogleTag = require("../../GoogleTag");
const logger = require("@grucloud/core/logger")({ prefix: "GcpDnsSpec" });

const {
  GcpDnsManagedZone,
  compareDnsManagedZone,
} = require("./GcpDnsManagedZone");

//const { GcpDomain, compareDomain } = require("./GcpDomain");

module.exports = (config) => [
  {
    type: "DnsManagedZone",
    Client: ({ spec }) =>
      GcpDnsManagedZone({
        spec,
        config,
      }),
    isOurMinion: GoogleTag.isOurMinion,
    compare: compareDnsManagedZone,
  },
];
