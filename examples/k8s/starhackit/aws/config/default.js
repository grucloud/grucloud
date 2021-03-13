const pkg = require("../package.json");

module.exports = () => ({
  projectName: pkg.name,
  namespaceName: "default",
  cluster: { name: "cluster" },
  ingress: { apiVersion: "networking.k8s.io/v1beta1" },
  vpc: {
    CidrBlock: "192.168.0.0/16",
    subnetsPublic: [
      {
        name: "subnet-public-1",
        CidrBlock: "192.168.0.0/19",
        AvailabilityZone: "eu-west-2a",
      },
      {
        name: "subnet-public-2",
        CidrBlock: "192.168.32.0/19",
        AvailabilityZone: "eu-west-2b",
      },
      {
        name: "subnet-public-3",
        CidrBlock: "192.168.64.0/19",
        AvailabilityZone: "eu-west-2c",
      },
    ],
    subnetsPrivate: [
      {
        name: "subnet-private-1",
        CidrBlock: "192.168.96.0/19",
        AvailabilityZone: "eu-west-2a",
      },
      {
        name: "subnet-private-2",
        CidrBlock: "192.168.128.0/19",
        AvailabilityZone: "eu-west-2b",
      },
      {
        name: "subnet-private-3",
        CidrBlock: "192.168.160.0/19",
        AvailabilityZone: "eu-west-2c",
      },
    ],
  },
  clusterRole: {
    name: "alb-cluster-role",
  },
  ui: {
    container: { image: "fredericheem/ui", version: "v10.14.0" },
    serviceName: "web",
    deploymentName: "web",
    label: "ui",
    port: 80,
    containerPort: 3000,
  },
  restServer: {
    container: { image: "fredericheem/api", version: "v10.14.0" },
    serviceName: "rest",
    deploymentName: "rest",
    label: "rest",
    port: 9000,
  },
  pv: { name: "pv-db" },
  postgres: {
    statefulSetName: "postgres",
    serviceName: "postgres",
    label: "db",
    port: 5432,
    env: {
      POSTGRES_USER: "dbuser",
      POSTGRES_PASSWORD: "peggy went to the market",
      POSTGRES_DB: "main",
    },
  },
  redis: {
    container: { image: "redis", version: "latest" },
    serviceName: "redis",
    statefulSetName: "redis",
    label: "redis",
    port: 6379,
  },
  storageClassName: "my-storage-class",
});
