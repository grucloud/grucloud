const assert = require("assert");
const {
  pipe,
  tap,
  assign,
  map,
  pick,
  get,
  filter,
  eq,
  switchCase,
} = require("rubico");
const { isEmpty, find, when, callProp } = require("rubico/x");
const {
  buildGetId,
  compare,
  replaceWithName,
} = require("@grucloud/core/Common");

const { isOurMinion } = require("../AwsCommon");
const {
  CloudFrontDistribution,
  compareDistribution,
} = require("./CloudFrontDistribution");
const {
  CloudFrontOriginAccessIdentity,
} = require("./CloudFrontOriginAccessIdentity");

const GROUP = "CloudFront";

const replaceWithBucketName = replaceWithName({ groupType: "S3::Bucket" });

module.exports = () =>
  map(assign({ group: () => GROUP }))([
    {
      type: "Distribution",
      //TODO remove dependsOn
      dependsOn: [
        "ACM::Certificate",
        "S3::Bucket",
        "CloudFront::OriginAccessIdentity",
      ],
      dependencies: {
        buckets: { type: "Bucket", group: "S3", list: true },
        certificate: { type: "Certificate", group: "ACM" },
        originAccessIdentities: {
          type: "OriginAccessIdentity",
          group: "CloudFront",
          list: true,
        },
      },
      Client: CloudFrontDistribution,
      isOurMinion,
      compare: compareDistribution,
      filterLive: ({ lives }) =>
        pipe([
          pick([
            "PriceClass",
            "Aliases",
            "DefaultRootObject",
            "DefaultCacheBehavior",
            "Origins",
            "Restrictions",
            "Comment",
            "Logging",
          ]),
          assign({
            Aliases: pipe([
              get("Aliases"),
              assign({
                Items: pipe([
                  get("Items"),
                  map((certificateName) =>
                    pipe([
                      () => lives,
                      filter(eq(get("groupType"), "ACM::Certificate")),
                      find(eq(get("name"), certificateName)),
                      switchCase([
                        isEmpty,
                        () => certificateName,
                        (resource) =>
                          pipe([
                            () => resource,
                            buildGetId({ path: "name" }),
                            (getId) => () => getId,
                          ])(),
                      ]),
                    ])()
                  ),
                ]),
              }),
            ]),
            Comment: ({ Comment }) =>
              replaceWithBucketName({
                lives,
                Id: Comment,
              }),
            DefaultCacheBehavior: pipe([
              get("DefaultCacheBehavior"),
              assign({
                TargetOriginId: ({ TargetOriginId }) =>
                  replaceWithBucketName({
                    lives,
                    Id: TargetOriginId,
                  }),
              }),
            ]),
            Origins: pipe([
              get("Origins"),
              assign({
                Items: pipe([
                  get("Items"),
                  map(
                    pipe([
                      assign({
                        DomainName: ({ DomainName }) =>
                          replaceWithBucketName({
                            lives,
                            Id: DomainName,
                          }),
                        Id: ({ Id }) =>
                          replaceWithBucketName({
                            lives,
                            Id,
                          }),
                        S3OriginConfig: pipe([
                          get("S3OriginConfig"),
                          when(
                            get("OriginAccessIdentity"),
                            assign({
                              OriginAccessIdentity: ({
                                OriginAccessIdentity,
                              }) =>
                                pipe([
                                  () => ({ Id: OriginAccessIdentity, lives }),
                                  tap((params) => {
                                    assert(true);
                                  }),
                                  replaceWithName({
                                    groupType:
                                      "CloudFront::OriginAccessIdentity",
                                    path: "id",
                                  }),
                                ])(),
                            })
                          ),
                        ]),
                      }),
                    ])
                  ),
                ]),
              }),
            ]),
          }),
        ]),
    },
    {
      type: "OriginAccessIdentity",
      Client: CloudFrontOriginAccessIdentity,
      filterLive: ({ lives }) => pipe([pick([])]),
      compare,
    },
  ]);
