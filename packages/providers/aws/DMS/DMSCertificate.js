const assert = require("assert");
const { pipe, tap, get, pick, assign, omit } = require("rubico");
const { defaultsDeep, pluck } = require("rubico/x");

const { buildTags } = require("../AwsCommon");
const { getByNameCore } = require("@grucloud/core/Common");

const { Tagger, listTagsForResource } = require("./DMSCommon");

const buildArn = () =>
  pipe([
    get("CertificateArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ CertificateArn }) => {
    assert(CertificateArn);
  }),
  pick(["CertificateArn"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    listTagsForResource({ endpoint, buildArn: buildArn() }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DMS.html
exports.DMSCertificate = ({ compare }) => ({
  type: "Certificate",
  package: "database-migration-service",
  client: "DatabaseMigrationService",
  propertiesDefault: {},
  omitProperties: [
    "CertificateCreationDate",
    "CertificateArn",
    "CertificateOwner",
    "ValidFromDate",
    "ValidToDate",
    "SigningAlgorithm",
    "KeyLength",
  ],
  inferName: () =>
    pipe([
      get("CertificateIdentifier"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("CertificateIdentifier"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("CertificateArn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  dependencies: {},
  ignoreErrorCodes: ["ResourceNotFoundFault"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DMS.html#describeCertificates-property
  getById: {
    method: "describeCertificates",
    getField: "Certificates",
    pickId: pipe([
      tap(({ CertificateArn }) => {
        assert(CertificateArn);
      }),
      ({ CertificateArn }) => ({
        Filters: [
          {
            Name: "certificate-arn",
            Values: [CertificateArn],
          },
        ],
      }),
    ]),
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DMS.html#describeCertificates-property
  getList: {
    method: "describeCertificates",
    getParam: "Certificates",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DMS.html#importCertificate-property
  create: {
    method: "importCertificate",
    pickCreated: ({ payload }) => pipe([get("Certificate")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DMS.html#deleteCertificate-property
  destroy: {
    method: "deleteCertificate",
    pickId,
  },
  getByName: getByNameCore,
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: {},
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        Tags: buildTags({ name, config, namespace, UserTags: Tags }),
      }),
    ])(),
});
