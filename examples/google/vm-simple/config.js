module.exports = ({ stage }) => ({
  projectName: () => "vm-tuto1",
  projectId: () => "vm-tuto1",
  vm: {
    name: "web-server",
    properties: {
      diskSizeGb: "20",
      machineType: "f1-micro",
      sourceImage:
        "projects/ubuntu-os-cloud/global/images/family/ubuntu-2004-lts",
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
});
