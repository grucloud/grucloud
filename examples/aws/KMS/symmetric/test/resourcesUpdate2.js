exports.createResources = () => [
  {
    type: "Key",
    group: "KMS",
    name: "key-test",
    properties: () => ({
      Tags: [{ TagKey: "mykey-new", TagValue: "value" }],
    }),
  },
];
