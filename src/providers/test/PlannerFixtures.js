exports.azSpecs = [
  { name: "rg" },
  { name: "vnet", dependsOn: ["rg"] },
  { name: "sg", dependsOn: ["rg"] },
  {
    name: "network-interface",
    dependsOn: ["rg", "vnet", "sg"],
  },
];
const azPlans = [
  {
    resource: {
      name: "rg",
      type: "ResourceGroup",
      provider: "azure",
    },
  },
  {
    resource: {
      name: "vnet",
      type: "VirtualNetwork",
      provider: "azure",
    },
  },
  {
    resource: {
      name: "sg",
      type: "SecurityGroup",
      provider: "azure",
    },
  },
  {
    resource: {
      name: "network-interface",
      type: "NetworkInterface",
      provider: "azure",
    },
  },
];

const addAction = (plans, action) => plans.map((plan) => ({ ...plan, action }));

exports.azPlansCreate = () => addAction(azPlans, "CREATE");
exports.azPlansDestroy = () => addAction(azPlans, "DESTROY");

exports.awsSpecs = [
  { name: "vpc" },
  { name: "ig", dependsOn: ["vpc"] },
  { name: "subnet", dependsOn: ["vpc"] },
  {
    name: "rt",
    dependsOn: ["vpc", "subnet", "ig"],
  },
  { name: "sg", dependsOn: ["vpc"] },
  {
    name: "instance",
    dependsOn: ["subnet", "sg", "eip"],
  },
  {
    name: "eip",
    dependsOn: ["ig", "instance"],
  },
];

const awsPlans = [
  {
    resource: {
      name: "vpc",
      type: "Vpc",
      provider: "aws",
    },
  },
  {
    resource: {
      name: "subnet",
      type: "Subnet",
      provider: "aws",
    },
  },
  {
    resource: {
      name: "rt",
      type: "RouteTables",
      provider: "aws",
    },
  },
  {
    resource: {
      name: "sg",
      type: "SecurityGroup",
      provider: "aws",
    },
  },
  {
    resource: {
      name: "instance",
      type: "Instance",
      provider: "aws",
    },
  },
];

exports.awsPlansCreate = () => addAction(awsPlans, "CREATE");
exports.awsPlansDestroy = () => addAction(awsPlans, "DESTROY");
