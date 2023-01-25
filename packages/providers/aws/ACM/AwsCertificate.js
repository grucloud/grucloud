const assert = require("assert");
const {
  pipe,
  tap,
  get,
  assign,
  pick,
  switchCase,
  omit,
  eq,
  and,
} = require("rubico");
const {
  first,
  defaultsDeep,
  when,
  callProp,
  find,
  last,
  size,
  isEmpty,
  identity,
} = require("rubico/x");
const fs = require("fs");
const fsAsync = require("fs").promises;

const crypto = require("crypto");

const { retryCall } = require("@grucloud/core/Retry");
const { getByNameCore } = require("@grucloud/core/Common");

const { buildTags } = require("../AwsCommon");
const { tagResource, untagResource } = require("./ACMCommon");

//const buildArn = () => get("CertificateArn");

const pickId = pick(["CertificateArn"]);

const getCommonNameFromCertificate = pipe([
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

exports.getCommonNameFromCertificate = getCommonNameFromCertificate;

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
exports.AwsCertificate = ({ compare }) => ({
  type: "Certificate",
  package: "acm",
  client: "ACM",
  findName: () => get("DomainName"),
  findId: () => get("CertificateArn"),
  omitProperties: [],
  compare: compare({
    filterTarget: () => pipe([pick([])]),
    //TODO recreate
    filterLive: () => pipe([pick([])]),
  }),
  ignoreResource: ({ lives }) => pipe([get("usedBy"), isEmpty]),
  inferName: () =>
    pipe([
      switchCase([
        get("certificateFile"),
        pipe([
          get("certificateFile"),
          (certificateFile) => fs.readFileSync(certificateFile, "utf-8"),
          getCommonNameFromCertificate,
          tap((CN) => {
            assert(CN);
          }),
        ]),
        pipe([
          get("DomainName"),
          tap((DomainName) => {
            assert(DomainName);
          }),
        ]),
      ]),
    ]),
  filterLive: () =>
    pipe([
      pick(["DomainName", "SubjectAlternativeNames"]),
      when(
        ({ DomainName, SubjectAlternativeNames }) =>
          pipe([
            () => SubjectAlternativeNames,
            and([eq(size, 1), pipe([first, eq(identity, DomainName)])]),
          ])(),
        omit(["SubjectAlternativeNames"])
      ),
    ]),
  getByName: getByNameCore,
  cannotBeDeleted: () => () => true,
  create: ({ endpoint, getById }) =>
    pipe([
      get("payload"),
      switchCase([
        get("Certificate"),
        importCertificate({ endpoint }),
        requestCertificate({ endpoint, getById }),
      ]),
    ]),
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
  tagger: ({ config }) => ({
    tagResource,
    untagResource,
  }),
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
    config,
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
            Certificate: pipe([
              () => fsAsync.readFile(certificateFile, "utf-8"),
            ]),
            PrivateKey: pipe([() => fsAsync.readFile(privateKeyFile, "utf-8")]),
          }),
          when(
            () => certificateChainFile,
            assign({
              CertificateChain: pipe([
                () => fsAsync.readFile(certificateChainFile, "utf-8"),
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
