exports.createResources = () => [
  {
    type: "Key",
    group: "KMS",
    name: "key-test",
    properties: () => ({
      Enabled: false,
    }),
  },
];
