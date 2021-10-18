const { pipe, assign, map, pick } = require("rubico");
const { isOurMinion } = require("../AwsCommon");
const { AwsDomain } = require("./AwsDomain");

const GROUP = "Route53Domains";

module.exports = () =>
  map(assign({ group: () => GROUP }))([
    {
      type: "Domain",
      Client: AwsDomain,
      listOnly: true,
      isOurMinion,
      filterLive: () => pick([]),
    },
  ]);
