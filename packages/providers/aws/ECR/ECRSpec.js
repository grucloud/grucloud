const assert = require("assert");
const { tap, assign, map, pipe, omit, pick, get, not, and } = require("rubico");
const { callProp, when } = require("rubico/x");

const { omitIfEmpty } = require("@grucloud/core/Common");

const { compareAws, isOurMinionFactory } = require("../AwsCommon");
const { EcrRepository } = require("./EcrRepository");
const { EcrRegistry } = require("./EcrRegistry");

const GROUP = "ECR";

const tagsKey = "tags";
const compareECR = compareAws({ tagsKey });

const isOurMinion = isOurMinionFactory({ tags: tagsKey });

module.exports = () =>
  map(assign({ group: () => GROUP }))([
    {
      type: "Repository",
      Client: EcrRepository,
      isOurMinion,
      compare: compareECR({
        filterLive: () =>
          pipe([
            omit(["repositoryArn", "registryId", "repositoryUri", "createdAt"]),
            omitIfEmpty(["lifecyclePolicyText", "policyText"]),
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
          when(
            get("policyText"),
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
            })
          ),
        ]),
    },
    {
      type: "Registry",
      Client: EcrRegistry,
      isOurMinion,
      compare: compareECR({
        filterLive: () => pipe([omit(["registryId"])]),
      }),
      ignoreResource: () =>
        pipe([
          get("live"),
          not(and([get("policyText"), get("replicationConfiguration")])),
        ]),
      filterLive: () =>
        pipe([pick(["policyText", "replicationConfiguration"])]),
    },
  ]);
