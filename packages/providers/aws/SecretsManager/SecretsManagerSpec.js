const assert = require("assert");
const { pipe, map, tap, omit, assign, get } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { compareAws, assignPolicyAccountAndRegion } = require("../AwsCommon");
const { createAwsService } = require("../AwsService");

const { SecretsManagerSecret } = require("./SecretsManagerSecret");
const {
  SecretsManagerResourcePolicy,
} = require("./SecretsManagerResourcePolicy");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SecretsManager.html
const GROUP = "SecretsManager";

const compare = compareAws({});

module.exports = pipe([
  () => [
    createAwsService(SecretsManagerSecret({ compare })),
    {
      type: "ResourcePolicy",
      Client: SecretsManagerResourcePolicy,
      inferName: get("dependenciesSpec.secret"),
      dependencies: {
        secret: {
          type: "Secret",
          group: GROUP,
          parent: true,
          dependencyId: ({ lives, config }) => get("ARN"),
        },
      },
      omitProperties: ["ARN", "Name"],
      compare: compare({
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
      compare: compare({
        filterAll: () =>
          pipe([
            tap((params) => {
              assert(true);
            }),
          ]),
      }),
    })
  ),
]);
