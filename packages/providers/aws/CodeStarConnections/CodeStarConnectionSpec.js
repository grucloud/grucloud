const assert = require("assert");
const { tap, pipe, map, get } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { isOurMinion, compareAws } = require("../AwsCommon");
const {
  CodeStarConnectionsConnection,
} = require("./CodeStarConnectionsConnection");

//TODO Host

const GROUP = "CodeStarConnections";

const compareCodeStarConnection = compareAws({ tagsKey: "tags" });

module.exports = pipe([
  () => [
    {
      type: "Connection",
      Client: CodeStarConnectionsConnection,
      inferName: pipe([get("properties.ConnectionName")]),
      omitProperties: [
        "ConnectionArn",
        "ConnectionStatus",
        "OwnerAccountId",
        "HostArn",
      ],
      //TODO Host
      //dependencies: { type: "Host", group: GROUP },
      propertiesDefault: {},
    },
  ],
  map(
    defaultsDeep({
      group: GROUP,
      isOurMinion,
      compare: compareCodeStarConnection({}),
    })
  ),
]);
