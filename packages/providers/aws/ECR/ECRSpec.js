const assert = require("assert");
const { tap, assign, map, pipe, omit, pick, get, not, and } = require("rubico");
const { callProp, when, defaultsDeep } = require("rubico/x");

const { omitIfEmpty } = require("@grucloud/core/Common");

const { compareAws, ignoreResourceCdk } = require("../AwsCommon");

const { createAwsService } = require("../AwsService");

const { EcrRepository } = require("./EcrRepository");
const { ECRRegistry } = require("./EcrRegistry");

const GROUP = "ECR";

const tagsKey = "tags";
const compare = compareAws({ tagsKey });

module.exports = pipe([
  () => [
    {
      type: "Repository",
      Client: EcrRepository,
      inferName: () => get("repositoryName"),
      compare: compare({
        filterLive: () =>
          pipe([
            omit(["repositoryArn", "registryId", "repositoryUri", "createdAt"]),
            omitIfEmpty(["lifecyclePolicyText", "policyText"]),
          ]),
      }),
      ignoreResource: ignoreResourceCdk,
      filterLive: ({ providerConfig }) =>
        pipe([
          pick([
            "repositoryName",
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
    createAwsService(ECRRegistry({ compare })),
  ],
  map(
    defaultsDeep({
      group: GROUP,
      tagsKey,
      compare: compare({}),
    })
  ),
]);
