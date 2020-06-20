exports.azSpecs = [
  { type: "ResourceGroup" },
  { type: "VirtualNetwork", dependsOn: ["ResourceGroup"] },
  { type: "SecurityGroup", dependsOn: ["ResourceGroup"] },
  {
    type: "NetworkInterface",
    dependsOn: ["ResourceGroup", "VirtualNetwork", "SecurityGroup"],
  },
];
const azPlans = [
  {
    resource: {
      name: "rg",
      type: "ResourceGroup",
      provider: "azure",
    },
    config: {},
  },
  {
    resource: {
      name: "vnet",
      type: "VirtualNetwork",
      provider: "azure",
    },
    config: {},
  },
  {
    resource: {
      name: "sg",
      type: "SecurityGroup",
      provider: "azure",
    },
    config: {},
  },
  {
    resource: {
      name: "network-interface",
      type: "NetworkInterface",
      provider: "azure",
    },
    config: {},
  },
];

const addAction = (plans, action) => plans.map((plan) => ({ ...plan, action }));

exports.azPlansCreate = () => addAction(azPlans, "CREATE");
exports.azPlansDestroy = () => addAction(azPlans, "DESTROY");

exports.awsSpecs = [
  { type: "Vpc" },
  { type: "Subnet", dependsOn: ["Vpc"] },
  { type: "SecurityGroup", dependsOn: ["Vpc"] },
  {
    type: "Instance",
    dependsOn: ["Subnet", "SecurityGroup"],
  },
];

const awsPlans = [
  {
    resource: {
      name: "vpc",
      type: "Vpc",
      provider: "aws",
    },
    config: {},
  },
  {
    resource: {
      name: "subnet",
      type: "Subnet",
      provider: "aws",
    },
    config: {},
  },
  {
    resource: {
      name: "sg",
      type: "SecurityGroup",
      provider: "aws",
    },
    config: {},
  },
  {
    resource: {
      name: "instance",
      type: "Instance",
      provider: "aws",
    },
    config: {},
  },
];

exports.awsPlansCreate = () => addAction(awsPlans, "CREATE");
exports.awsPlansDestroy = () => addAction(awsPlans, "DESTROY");
