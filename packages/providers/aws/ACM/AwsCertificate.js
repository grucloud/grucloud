const assert = require("assert");
const { pipe, tap, get, assign, pick, switchCase } = require("rubico");
const { first, defaultsDeep, when, callProp, find, last } = require("rubico/x");
const fs = require("fs").promises;
const crypto = require("crypto");

const { retryCall } = require("@grucloud/core/Retry");
const { getByNameCore } = require("@grucloud/core/Common");

const { buildTags } = require("../AwsCommon");
const { createAwsResource } = require("../AwsClient");
const { tagResource, untagResource } = require("./ACMCommon");

const pickId = pick(["CertificateArn"]);

exports.getCommonNameFromCertificate = pipe([
  (certificatePem) => new crypto.X509Certificate(certificatePem),
  callProp("toLegacyObject"),
  get("subject"),
  callProp("split", "\n"),
  find(callProp("startsWith", "CN")),
  tap((CN) => {
    assert(CN);
  }),
  callProp("split", "="),
  last,
  tap((CN) => {
    assert(CN);
  }),
]);

const decorate = ({ endpoint }) =>
  pipe([
    assign({
      Tags: pipe([
        pick(["CertificateArn"]),
        endpoint().listTagsForCertificate,
        get("Tags"),
      ]),
    }),
  ]);

const createModel = () => ({
  package: "acm",
  client: "ACM",
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ACM.html#describeCertificate-property
  getById: {
    method: "describeCertificate",
    pickId,
    getField: "Certificate",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ACM.html#listCertificates-property
  getList: {
    method: "listCertificates",
    getParam: "CertificateSummaryList",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ACM.html#deleteCertificate-property
  destroy: { method: "deleteCertificate", pickId },
});

const isInstanceUp = pipe([
  get("DomainValidationOptions"),
  first,
  get("ResourceRecord"),
]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ACM.html#requestCertificate-property
const requestCertificate = ({ endpoint, getById }) =>
  pipe([
    endpoint().requestCertificate,
    (params) =>
      retryCall({
        name: `requestCertificate`,
        fn: pipe([() => params, getById, isInstanceUp]),
        //config: configIsUp,
      }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ACM.html#importCertificate-property
const importCertificate = ({ endpoint }) =>
  pipe([
    assign({
      Certificate: pipe([get("Certificate"), Buffer.from]),
      PrivateKey: pipe([get("PrivateKey"), Buffer.from]),
    }),
    when(
      get("CertificateChain"),
      assign({
        CertificateChain: pipe([get("CertificateChain"), Buffer.from]),
      })
    ),
    endpoint().importCertificate,
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ACM.html
exports.AwsCertificate = ({ spec, config }) =>
  createAwsResource({
    model: createModel({ config }),
    config,
    spec,
    findName: () => get("DomainName"),
    findId: () => get("CertificateArn"),
    getByName: getByNameCore,
    cannotBeDeleted: () => () => true,
    tagResource,
    untagResource,
    create: ({ endpoint, getById }) =>
      pipe([
        get("payload"),
        switchCase([
          get("Certificate"),
          importCertificate({ endpoint }),
          requestCertificate({ endpoint, getById }),
        ]),
      ]),
    configDefault: ({
      name,
      namespace,
      properties: {
        privateKeyFile,
        certificateFile,
        certificateChainFile,
        Tags,
        ...otherProps
      },
    }) =>
      pipe([
        () => otherProps,
        defaultsDeep({
          Tags: buildTags({ name, namespace, config, UserTags: Tags }),
        }),
        switchCase([
          () => privateKeyFile,
          // Import certificate
          pipe([
            tap((params) => {
              assert(certificateFile);
            }),
            assign({
              Certificate: pipe([() => fs.readFile(certificateFile, "utf-8")]),
              PrivateKey: pipe([() => fs.readFile(privateKeyFile, "utf-8")]),
            }),
            when(
              () => certificateChainFile,
              assign({
                CertificateChain: pipe([
                  () => fs.readFile(certificateChainFile, "utf-8"),
                ]),
              })
            ),
          ]),
          // AWS issued certificate
          defaultsDeep({
            DomainName: name,
            ValidationMethod: "DNS",
          }),
        ]),
        tap((params) => {
          assert(true);
        }),
      ])(),
  });
