const assert = require("assert");
const { tap, assign, map, pipe, omit, pick, get, not, and } = require("rubico");
const { callProp } = require("rubico/x");

const { compare } = require("@grucloud/core/Common");

const { isOurMinionFactory } = require("../AwsCommon");
const { EcrRepository } = require("./EcrRepository");
const { EcrRegistry, compareRegistry } = require("./EcrRegistry");

const GROUP = "ECR";

const isOurMinion = isOurMinionFactory({ tags: "tags" });

module.exports = () =>
  map(assign({ group: () => GROUP }))([
    {
      type: "Repository",
      Client: EcrRepository,
      isOurMinion,
      compare: compare({
        filterLive: pipe([
          omit(["repositoryArn", "registryId", "repositoryUri", "createdAt"]),
        ]),
      }),
      filterLive: ({ providerConfig }) =>
        pipe([
          pick([
            "imageTagMutability",
            "imageScanningConfiguration",
            "encryptionConfiguration",
            "policyText",
            "lifecyclePolicyText",
          ]),
          assign({
            policyText: pipe([
              get("policyText"),
              assign({
                Statement: pipe([
                  get("Statement"),
                  map(
                    assign({
                      Principal: pipe([
                        get("Principal.AWS"),
                        callProp(
                          "replace",
                          providerConfig.accountId(),
                          "${config.accountId()}"
                        ),
                        (principal) => ({
                          AWS: () => "`" + principal + "`",
                        }),
                      ]),
                    })
                  ),
                ]),
              }),
            ]),
          }),
        ]),
    },
    {
      type: "Registry",
      Client: EcrRegistry,
      isOurMinion,
      compare: compareRegistry,
      ignoreResource: () =>
        pipe([
          tap((params) => {
            assert(true);
          }),
          get("live"),
          not(and([get("policyText"), get("replicationConfiguration")])),
          tap((params) => {
            assert(true);
          }),
        ]),

      filterLive: () =>
        pipe([pick(["policyText", "replicationConfiguration"])]),
    },
  ]);
