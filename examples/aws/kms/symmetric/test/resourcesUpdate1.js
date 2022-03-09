exports.createResources = () => [
  {
    type: "Key",
    group: "KMS",
    name: "key-test",
    properties: () => ({
      Enabled: false,
      Tags: [{ TagKey: "mykey1", TagValue: "value" }],
    }),
  },
];
