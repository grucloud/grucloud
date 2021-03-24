module.exports = () => ({
  redis: {
    serviceName: "redis",
    statefulSetName: "redis",
    label: "redis",
    image: "redis",
    port: 6379,
  },
});
