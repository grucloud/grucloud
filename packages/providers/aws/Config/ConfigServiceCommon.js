const assert = require("assert");

const { pipe, tap, get, fork, assign, tryCatch } = require("rubico");
const { defaultsDeep, when, first, isIn } = require("rubico/x");
const Json2yaml = require("@grucloud/core/cli/json2yaml");

const { deepMap } = require("@grucloud/core/deepMap");

const { createTagger } = require("../AwsTagger");

exports.Tagger = createTagger({
  methodTagResource: "tagResource",
  methodUnTagResource: "untagResource",
  ResourceArn: "ResourceArn",
  TagsKey: "Tags",
  UnTagsKey: "TagKeys",
});

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppConfig.html#listTagsForResource-property
exports.assignTags = ({ buildArn, endpoint }) =>
  pipe([
    assign({
      Tags: tryCatch(
        pipe([
          buildArn,
          (ResourceArn) => ({ ResourceArn }),
          endpoint().listTagsForResource,
          get("Tags"),
        ]),
        (error) => []
      ),
    }),
  ]);
exports.conformancePackdependencies = {
  stack: {
    type: "Stack",
    group: "CloudFormation",
    parent: true,
    dependsOnTypeOnly: true,
  },
  s3BucketDelivery: {
    type: "Bucket",
    group: "S3",
    dependencyId: ({ lives, config }) => pipe([get("DeliveryS3Bucket")]),
  },
  s3BucketTemplate: {
    type: "Bucket",
    group: "S3",
    dependencyId: ({ lives, config }) => pipe([get("TemplateS3Uri")]),
  },
};

exports.conformanceDecorate =
  ({ describeConformancePackStatus, ConformancePackStatusDetails }) =>
  ({ endpoint, parent, lives, config }) =>
  (live) =>
    pipe([
      tap((params) => {
        assert(lives);
      }),
      () => live,
      fork({
        TemplateBody: pipe([
          ({ ConformancePackName, ConformancePackId }) =>
            `awsconfigconforms-${ConformancePackName}-${ConformancePackId}`,
          lives.getByName({
            type: "Stack",
            group: "CloudFormation",
            providerName: config.providerName,
          }),
          get("live.TemplateBody"),
          // When creating the conformance pack, the resulting ConfigRuleName property value is suffixed the the ConformancePackId
          // This code the suffix from the response
          deepMap(
            when(
              ([key, value]) => key == "ConfigRuleName",
              ([key, value]) => [
                key,
                value.replace(`-${live.ConformancePackId}`, ""),
              ]
            )
          ),
        ]),
        Details: pipe([
          ({ ConformancePackName }) => ({
            ConformancePackNames: [ConformancePackName],
          }),
          endpoint()[describeConformancePackStatus],
          get(ConformancePackStatusDetails),
          first,
        ]),
        // Rules: pipe([
        //   pickId,
        //   endpoint().describeConformancePackCompliance,
        //   get("ConformancePackRuleComplianceList"),
        // ]),
      }),
      ({ Details, ...other }) => ({ ...Details, ...other }),
      tap((params) => {
        assert(true);
      }),
      defaultsDeep(live),
    ])();

const filterPayload = pipe([
  assign({
    TemplateBody: pipe([
      get("TemplateBody"),
      tap((TemplateBody) => {
        assert(TemplateBody);
      }),
      Json2yaml.stringify,
    ]),
  }),
]);

exports.conformanceCreate = ({ putConformancePack }) => ({
  filterPayload,
  method: putConformancePack,
  pickCreated: ({ payload }) => pipe([() => payload]),
  isInstanceUp: pipe([get("ConformancePackState"), isIn(["CREATE_COMPLETE"])]),
  isInstanceError: pipe([get("ConformancePackState"), isIn(["FAILED"])]),
  getErrorMessage: pipe([get("ConformancePackStatusReason", "FAILED")]),
});
