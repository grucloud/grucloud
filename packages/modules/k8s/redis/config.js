module.exports = () => ({
  redis: {
    container: { image: "redis", version: "latest" },
    serviceName: "redis",
    statefulSetName: "redis",
    label: "redis",
    port: 6379,
  },
});
