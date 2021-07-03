const { pipe, assign, map } = require("rubico");
const assert = require("assert");

const GoogleTag = require("../../GoogleTag");
const logger = require("@grucloud/core/logger")({ prefix: "GcpDnsSpec" });

const GROUP = "dns";

const {
  GcpDnsManagedZone,
  compareDnsManagedZone,
} = require("./GcpDnsManagedZone");

//const { GcpDomain, compareDomain } = require("./GcpDomain");

module.exports = () =>
  map(assign({ group: () => GROUP }))([
    {
      type: "DnsManagedZone",
      Client: GcpDnsManagedZone,
      isOurMinion: GoogleTag.isOurMinion,
      compare: compareDnsManagedZone,
    },
  ]);
