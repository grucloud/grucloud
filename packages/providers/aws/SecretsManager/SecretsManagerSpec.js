const assert = require("assert");
const { pipe, map, tap, omit, assign, get } = require("rubico");
const { defaultsDeep, when, size } = require("rubico/x");

const { compareAws } = require("../AwsCommon");
const { SecretsManagerSecret } = require("./SecretsManagerSecret");
const {
  SecretsManagerResourcePolicy,
} = require("./SecretsManagerResourcePolicy");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SecretsManager.html
const GROUP = "SecretsManager";

const compareSecretsManager = compareAws({});

module.exports = pipe([
  () => [
    {
      type: "Secret",
      Client: SecretsManagerSecret,
      dependencies: { kmsKey: { type: "Key", group: "KMS" } },
      ignoreResource: () => pipe([get("live.OwningService")]),
      propertiesDefault: {},
      omitProperties: [
        "Name",
        "ARN",
        "CreatedDate",
        "LastAccessedDate",
        "LastChangedDate",
        "SecretVersionsToStages",
        "SecretString.DBClusterIdentifier",
        "SecretString.host",
      ],
      compare: compareSecretsManager({
        filterAll: () => pipe([omit(["SecretString", "SecretBinary"])]),
      }),
      filterLive: ({ providerConfig }) =>
        pipe([
          tap((params) => {
            assert(true);
          }),
          //TODO create function with various password keys
          assign({
            SecretString: pipe([
              get("SecretString"),
              when(
                get("password"),
                assign({
                  password: pipe([
                    get("password"),
                    (password) => () =>
                      `generatePassword({length:${size(password)}})`,
                  ]),
                })
              ),
            ]),
          }),
        ]),
    },
    //TODO
    // {
    //   type: "ResourcePolicy",
    //   Client: SecretsManagerResourcePolicy,
    //   dependencies: { secret: { type: "Secret", group: GROUP, parent: true } },
    //   propertiesDefault: {},
    //   omitProperties: ["Name", "ARN"],
    //   filterLive: ({ providerConfig }) =>
    //     pipe([
    //       tap((params) => {
    //         assert(providerConfig);
    //       }),
    //     ]),
    // },
  ],
  map(
    defaultsDeep({
      group: GROUP,
      compare: compareSecretsManager({}),
    })
  ),
]);
