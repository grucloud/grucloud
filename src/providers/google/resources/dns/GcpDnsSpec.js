const assert = require("assert");
const GoogleTag = require("../../GoogleTag");
const logger = require("../../../../logger")({ prefix: "GcpDnsSpec" });

const { GcpDnsManagedZone } = require("./GcpDnsManagedZone");
const { GcpDnsResourceRecordSet } = require("./GcpDnsResourceRecordSet");

module.exports = (config) => [
  {
    type: "DnsManagedZone",
    Client: ({ spec }) =>
      GcpDnsManagedZone({
        spec,
        config,
      }),
    isOurMinion: ({ resource }) => GoogleTag.isOurMinion({ resource, config }),
  },
  {
    type: "DnsResourceRecordSet",
    Client: ({ spec }) =>
      GcpDnsResourceRecordSet({
        spec,
        config,
      }),
    isOurMinion: ({ resource }) => GoogleTag.isOurMinion({ resource, config }),
  },
];
