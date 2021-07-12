const pkg = require("./package.json");
module.exports = ({ stage }) => ({
  projectId: pkg.name,
  compute: {
    Network: {
      rhmig: {
        name: "rhmig",
        properties: {
          autoCreateSubnetworks: false,
        },
      },
    },
    SubNetwork: {
      subnet_10_0_0_0_16: {
        name: "subnet-10-0-0-0-16",
        properties: {
          ipCidrRange: "10.0.0.0/16",
        },
      },
    },
    Disk: {
      extraDisk: {
        name: "extra-disk",
      },
    },
    VmInstance: {
      s1_2Uk1: {
        name: "s1-2-uk1",
        properties: {
          diskSizeGb: 20,
          sourceImage: "projects/centos-cloud/global/images/centos-8-v20210609",
          machineType: "e2-small",
          image: "projects/rhel-cloud/global/images/rhel-7-v20210609",
          metadata: {
            items: [
              {
                key: "enable-oslogin",
                value: "True",
              },
            ],
          },
        },
      },
    },
  },
});
