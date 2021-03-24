module.exports = () => ({
  postgres: {
    pvName: "pv-db",
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
});
