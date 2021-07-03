const { pipe, assign, map } = require("rubico");
const { isOurMinion } = require("../AwsCommon");
const { AwsDomain } = require("./AwsDomain");

const GROUP = "route53Domain";

module.exports = () =>
  map(assign({ group: () => GROUP }))([
    {
      type: "Route53Domain",
      Client: AwsDomain,
      listOnly: true,
      isOurMinion,
    },
  ]);
