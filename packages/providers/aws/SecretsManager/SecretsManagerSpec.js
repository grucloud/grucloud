const assert = require("assert");
const { pipe, map, tap, omit, assign, get } = require("rubico");
const { defaultsDeep, when, size } = require("rubico/x");

const { compareAws, assignPolicyAccountAndRegion } = require("../AwsCommon");
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
      inferName: get("properties.Name"),
      ignoreResource: () => pipe([get("live.OwningService")]),
      omitProperties: [
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
          ({ Name, ...other }) => ({ Name, ...other }),
        ]),
    },
    {
      type: "ResourcePolicy",
      Client: SecretsManagerResourcePolicy,
      inferName: get("dependenciesSpec.secret"),
      dependencies: { secret: { type: "Secret", group: GROUP, parent: true } },
      omitProperties: ["ARN", "Name"],
      compare: compareSecretsManager({
        filterAll: () => pipe([omit(["SecretId", "Name"])]),
      }),
      filterLive: ({ lives, providerConfig }) =>
        pipe([
          assign({
            ResourcePolicy: pipe([
              get("ResourcePolicy"),
              assignPolicyAccountAndRegion({ providerConfig, lives }),
            ]),
          }),
        ]),
    },
  ],
  map(
    defaultsDeep({
      group: GROUP,
      compare: compareSecretsManager({}),
    })
  ),
]);
