const pkg = require("./package.json");

module.exports = ({ stage }) => ({
  namespaceName: "default",
  ingress: { apiVersion: "networking.k8s.io/v1beta1" },
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
});
