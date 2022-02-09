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
const { isEmpty, find } = require("rubico/x");
const { buildGetId } = require("@grucloud/core/Common");

const { isOurMinion } = require("../AwsCommon");
const { AwsDistribution, compareDistribution } = require("./AwsDistribution");

const GROUP = "CloudFront";

const replaceWithBucketName = ({ lives, Id }) =>
  pipe([
    () => lives,
    filter(eq(get("groupType"), "S3::Bucket")),
    find(({ id }) => Id.match(new RegExp(id))),
    switchCase([
      isEmpty,
      () => Id,
      (resource) =>
        pipe([
          () => resource,
          buildGetId({ path: "name" }),
          (getId) => () =>
            "`" + Id.replace(new RegExp(resource.id), "${" + getId + "}") + "`",
        ])(),
    ]),
  ])();

module.exports = () =>
  map(assign({ group: () => GROUP }))([
    {
      type: "Distribution",
      dependsOn: ["ACM::Certificate", "S3::Bucket"],
      Client: AwsDistribution,
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
              replaceWithBucketName({ lives, Id: Comment }),
            DefaultCacheBehavior: pipe([
              get("DefaultCacheBehavior"),
              assign({
                TargetOriginId: ({ TargetOriginId }) =>
                  replaceWithBucketName({ lives, Id: TargetOriginId }),
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
                          replaceWithBucketName({ lives, Id: DomainName }),
                        Id: ({ Id }) => replaceWithBucketName({ lives, Id }),
                      }),
                    ])
                  ),
                ]),
              }),
            ]),
          }),
        ]),
      dependencies: {
        buckets: { type: "Bucket", group: "S3", list: true },
        certificate: { type: "Certificate", group: "ACM" },
      },
    },
  ]);
