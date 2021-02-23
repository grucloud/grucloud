const pkg = require("../package.json");

module.exports = () => ({
  projectName: pkg.name,
  namespaceName: "stateless",
  ui: {
    container: { image: "fredericheem/ui", version: "v10.12.0" },
    serviceName: "web-service",
    deploymentName: "web-deployment",
    label: "ui",
    port: 80,
    containerPort: 3000,
  },
  restServer: {
    container: { image: "fredericheem/api", version: "v10.11.0" },
    serviceName: "rest-service",
    deploymentName: "rest-deployment",
    label: "rest",
    port: 9000,
  },
  pv: { name: "pv-db" },
  postgres: {
    statefulSetName: "postgres-statefulset",
    serviceName: "postgres-service",
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
    serviceName: "redis-service",
    statefulSetName: "redis-deployment",
    label: "redis",
    port: 6379,
  },
  storageClassName: "my-storage-class",
});
