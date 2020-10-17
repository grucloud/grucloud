const { compare } = require("../../../../Utils");
const { tos } = require("../../../../tos");
const GoogleTag = require("../../GoogleTag");

const GcpNetwork = require("./GcpNetwork");
const GcpSubNetwork = require("./GcpSubNetwork");
const GcpFirewall = require("./GcpFirewall");
const GoogleVmInstance = require("./GcpVmInstance");
const GcpAddress = require("./GcpAddress");

module.exports = (config) => {
  const isOurMinion = ({ resource }) =>
    GoogleTag.isOurMinion({ resource, config });

  return [
    {
      type: "Network",
      Client: ({ spec }) =>
        GcpNetwork({
          spec,
          config,
        }),
      isOurMinion,
    },
    {
      type: "SubNetwork",
      dependsOn: ["Network"],
      Client: ({ spec }) =>
        GcpSubNetwork({
          spec,
          config,
        }),
      isOurMinion,
    },
    {
      type: "Firewall",
      dependsOn: ["Network"],
      Client: ({ spec }) =>
        GcpFirewall({
          spec,
          config,
        }),
      isOurMinion,
    },
    {
      type: "Address",
      Client: ({ spec }) =>
        GcpAddress({
          spec,
          config,
        }),
      isOurMinion,
    },
    {
      type: "VmInstance",
      dependsOn: ["ServiceAccount", "Address", "Network", "Firewall"],
      Client: ({ spec }) =>
        GoogleVmInstance({
          spec,
          config,
        }),
      propertiesDefault: {
        machineType: "f1-micro",
        diskSizeGb: "10",
        diskType: "pd-standard",
        sourceImage:
          "projects/ubuntu-os-cloud/global/images/family/ubuntu-2004-lts",
      },
      compare: ({ target, live }) => {
        logger.debug(`compare server`);
        const diff = compare({
          target,
          targetKeys: [], //TODO
          live,
        });
        logger.debug(`compare ${tos(diff)}`);
        return diff;
      },
      isOurMinion,
    },
  ];
};
