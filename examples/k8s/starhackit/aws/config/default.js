const pkg = require("../package.json");

module.exports = () => ({
  projectName: pkg.name,
  namespaceName: "default",
  cluster: { name: "cluster" },
  ingress: { apiVersion: "networking.k8s.io/v1beta1" },
  vpc: {
    subnetsPrivate: [
      {
        name: "subnet-private-1",
        CidrBlock: "10.1.1.1/24",
        AvailabilityZone: "eu-west-2a",
      },
      {
        name: "subnet-private-2",
        CidrBlock: "10.1.2.1/24",
        AvailabilityZone: "eu-west-2b",
      },
      {
        name: "subnet-private-3",
        CidrBlock: "10.1.3.1/24",
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
