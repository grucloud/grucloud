const { GcpBucket } = require("./GcpBucket");
const { GcpObject, isGcpObjectOurMinion } = require("./GcpObject");
const GoogleTag = require("../../GoogleTag");

module.exports = (config) => [
  {
    type: "Bucket",
    Client: ({ spec }) =>
      GcpBucket({
        spec,
        config,
      }),
    isOurMinion: ({ resource }) => GoogleTag.isOurMinion({ resource, config }),
  },
  {
    type: "Object",
    Client: ({ spec }) =>
      GcpObject({
        spec,
        config,
      }),
    isOurMinion: ({ resource }) => isGcpObjectOurMinion({ resource, config }),
  },
];
