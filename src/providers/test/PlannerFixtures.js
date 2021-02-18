exports.azDependsOnType = [
  { type: "ResourceGroup", providerName: "azure" },
  {
    type: "VirtualNetwork",
    dependsOn: ["ResourceGroup"],
    providerName: "azure",
  },
  {
    type: "SecurityGroup",
    dependsOn: ["ResourceGroup"],
    providerName: "azure",
  },
  {
    type: "NetworkInterface",
    dependsOn: ["ResourceGroup", "VirtualNetwork", "SecurityGroup"],
    providerName: "azure",
  },
];

exports.azDependsOnInstance = [
  { uri: "az::ResourceGroup::rg" },
  {
    uri: "az::VirtualNetwork::vnet",
    dependsOn: [{ uri: "az::ResourceGroup::rg" }],
  },
  {
    uri: "az::SecurityGroup::sg",
    dependsOn: [{ uri: "az::ResourceGroup::rg" }],
  },
  {
    uri: "az::NetworkInterface::network-interface",
    dependsOn: [
      { uri: "az::ResourceGroup::rg" },
      { uri: "az::VirtualNetwork::vnet" },
      { uri: "az::SecurityGroup::sg" },
    ],
  },
];
const azPlans = [
  {
    resource: {
      name: "rg",
      type: "ResourceGroup",
      providerName: "azure",
      uri: "azure::ResourceGroup::rg",
    },
  },
  {
    resource: {
      name: "vnet",
      type: "VirtualNetwork",
      providerName: "azure",
      uri: "azure::VirtualNetwork::vnet",
    },
  },
  {
    resource: {
      name: "sg",
      type: "SecurityGroup",
      providerName: "azure",
      uri: "azure::SecurityGroup::sg",
    },
  },
  {
    resource: {
      name: "network-interface",
      type: "NetworkInterface",
      providerName: "azure",
      uri: "azure::NetworkInterface::network-interface",
    },
  },
];

const addAction = (plans, action) => plans.map((plan) => ({ ...plan, action }));

exports.azPlansCreate = () => addAction(azPlans, "CREATE");
exports.azPlansDestroy = () => addAction(azPlans, "DESTROY");

exports.awsDependsOnType = [
  { type: "Vpc", providerName: "aws" },
  { type: "InternetGateway", dependsOn: ["Vpc"], providerName: "aws" },
  { type: "Subnet", dependsOn: ["Vpc"], providerName: "aws" },
  {
    type: "RouteTables",
    dependsOn: ["Vpc", "Subnet", "InternetGateway"],
    providerName: "aws",
  },
  { type: "SecurityGroup", dependsOn: ["Vpc"], providerName: "aws" },
  {
    type: "Instance",
    dependsOn: ["Subnet", "SecurityGroup", "ElasticIpAddress"],
    providerName: "aws",
  },
  {
    type: "ElasticIpAddress",
    dependsOn: ["InternetGateway", "Instance"],
    providerName: "aws",
  },
];

exports.awsDependsOnInstance = [
  { uri: "aws::Vpc::vpc", name: "vpc", type: "Vpc" },
  {
    uri: "aws::InternetGateway::ig",
    name: "ig",
    type: "InternetGateway",
    dependsOn: [{ uri: "aws::Vpc::vpc", name: "vpc", type: "Vpc" }],
  },
  {
    uri: "aws::Subnet::subnet",
    name: "subnet",
    type: "Subnet",
    dependsOn: [{ uri: "aws::Vpc::vpc", name: "vpc", type: "Vpc" }],
  },
  {
    uri: "aws::RouteTables::rt",
    name: "rt",
    type: "RouteTables",
    dependsOn: [
      { uri: "aws::Vpc::vpc", name: "vpc", type: "Vpc" },
      { uri: "aws::Subnet::subnet", name: "subnet", type: "Subnet" },
      { uri: "aws::InternetGateway::ig", name: "ig", type: "InternetGateway" },
    ],
  },
  {
    uri: "aws::SecurityGroup::sg",
    name: "sg",
    type: "SecurityGroup",
    dependsOn: [{ uri: "aws::Vpc::vpc", name: "vpc", type: "Vpc" }],
  },
  {
    uri: "aws::Instance::instance",
    name: "instance",
    type: "Instance",
    dependsOn: [
      { uri: "aws::Subnet::subnet", name: "subnet", type: "Subnet" },
      { uri: "aws::SecurityGroup::sg", name: "sg", type: "SecurityGroup" },
      {
        uri: "aws::ElasticIpAddress::eip",
        name: "eip",
        type: "ElasticIpAddress",
      },
    ],
  },
  {
    uri: "aws::ElasticIpAddress::eip",
    name: "eip",
    type: "ElasticIpAddress",
    dependsOn: [
      { uri: "aws::InternetGateway::ig", name: "ig", type: "InternetGateway" },
      { uri: "aws::Instance::instance", name: "instance", type: "Instance" },
    ],
  },
];

const awsPlans = [
  {
    resource: {
      name: "vpc",
      type: "Vpc",
      providerName: "aws",
      uri: "aws::Vpc::vpc",
    },
  },
  {
    resource: {
      name: "subnet",
      type: "Subnet",
      providerName: "aws",
      uri: "aws::Subnet::subnet",
    },
  },
  {
    resource: {
      name: "rt",
      type: "RouteTables",
      providerName: "aws",
      uri: "aws::RouteTables::rt",
    },
  },
  {
    resource: {
      name: "sg",
      type: "SecurityGroup",
      providerName: "aws",
      uri: "aws::SecurityGroup::sg",
    },
  },
  {
    resource: {
      name: "instance",
      type: "Instance",
      providerName: "aws",
      uri: "aws::Instance::instance",
    },
  },
];

exports.awsPlansCreate = () => addAction(awsPlans, "CREATE");
exports.awsPlansDestroy = () => addAction(awsPlans, "DESTROY");
