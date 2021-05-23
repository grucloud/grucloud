module.exports = ({ stage }) => ({
  //credentialFile: "grucloud-vm-tuto-1.json",
  projectId: "grucloud-vm-tuto-1",
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
