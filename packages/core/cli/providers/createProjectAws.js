const assert = require("assert");
const { EOL } = require("os");
const {
  pipe,
  get,
  tap,
  assign,
  eq,
  map,
  tryCatch,
  switchCase,
} = require("rubico");
const {
  append,
  isEmpty,
  findIndex,
  when,
  includes,
  callProp,
  identity,
  unless,
} = require("rubico/x");

const shell = require("shelljs");
const { execCommandShell, myPrompts } = require("./createProjectCommon");

const createConfig = ({ profile, partition }) =>
  pipe([
    tap(() => {
      assert(profile);
      assert(partition);
    }),
    () => `const pkg = require("./package.json");
module.exports = () => ({
  projectName: pkg.name,
  // includeGroups: ["EC2", "ECS", "IAM", "KMS", "RDS"],
  // excludeGroups: [],
  credentials: { profile: "${profile}" },
  partition: "${partition}"
});
`,
    tap((params) => {
      assert(true);
    }),
  ])();

const PARTITIONS = [
  { title: "aws", description: "Public AWS partition" },
  { title: "aws-us-gov", description: "AWS US GovCloud" },
  { title: "aws-cn", description: " AWS China." },
];

const awsExecCommand =
  ({ displayText, textEnd } = {}) =>
  (command) =>
    pipe([
      () => `aws ${command}`,
      execCommandShell({
        transform: append(" --output json"),
        displayText,
        textEnd,
      }),
    ])();

exports.awsExecCommand = awsExecCommand;

const isAwsPresent = tap(
  pipe([
    () => "--version",
    tryCatch(
      pipe([
        awsExecCommand({
          textEnd: pipe([
            ({ textStart, result = "" }) =>
              `${textStart}\n${result.replace(EOL, "")}`,
          ]),
        }),
        tap((params) => {
          assert(true);
        }),
      ]),
      (error) => {
        console.error(
          "The aws CLI is not installed.\nVisit https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html to install the aws CLI\n"
        );
        process.exit(-1);
      }
    ),
  ])
);

exports.isAwsPresent = isAwsPresent;

const promptAccessKeyId = pipe([
  () => ({
    type: "text",
    name: "AWSAccessKeyId",
    message: "AWS Access Key ID",
    validate: (AWSAccessKeyId) =>
      isEmpty(AWSAccessKeyId) ? `should not be empty` : true,
  }),
  myPrompts,
  get("AWSAccessKeyId"),
]);

const promptSecretKey = pipe([
  () => ({
    type: "password",
    name: "AWSSecretKey",
    message: "AWS Secret Access Key",
    validate: (AWSSecretKey) =>
      isEmpty(AWSSecretKey) ? `should not be empty` : true,
  }),
  myPrompts,
  get("AWSSecretKey"),
]);

const initialRegionIndex = ({ currentRegion, regions }) =>
  pipe([
    tap((params) => {
      assert(regions);
    }),
    () => regions,
    findIndex(eq(get("RegionName"), currentRegion)),
    when(eq(identity, -1), () => 0),
  ])();

const promptProfile = pipe([
  tap(({ profile }) => {
    assert(profile);
  }),
  ({ profile }) => ({
    type: "text",
    name: "profile",
    message: "The AWS profile",
    initial: profile,
    validate: (profile) => (isEmpty(profile) ? `should not be empty` : true),
  }),
  myPrompts,
  get("profile"),
]);

const promptPartition = pipe([
  () => PARTITIONS,
  map(({ description, title }) => ({
    title,
    description,
    value: title,
  })),
  (choices) => ({
    type: "select",
    name: "partition",
    message: "Select a partition",
    choices,
    initial: 0,
  }),
  myPrompts,
  get("partition"),
]);

const promptRegion = pipe([
  tap((params) => {
    assert(true);
  }),
  assign({
    regions: pipe([
      ({ profile, regionMain }) =>
        `ec2 describe-regions --region ${regionMain} --profile ${profile}`,
      awsExecCommand(),
      get("Regions"),
    ]),
  }),
  assign({
    currentRegion: tryCatch(
      pipe([
        ({ profile }) => `configure get region --profile ${profile}`,
        awsExecCommand(),
        callProp("replace", EOL, ""),
        when(includes("undefined"), () => undefined),
      ]),
      () => undefined
    ),
  }),
  tap((params) => {
    assert(true);
  }),
  ({ regions, currentRegion, profile }) =>
    pipe([
      () => regions,
      map(({ RegionName }) => ({
        title: RegionName,
        description: RegionName,
        value: RegionName,
      })),
      (choices) => ({
        type: "autocomplete",
        limit: 40,
        name: "region",
        message: "Select a region",
        choices,
        initial: initialRegionIndex({ regions, currentRegion }),
      }),
      myPrompts,
      tap((params) => {
        assert(true);
      }),
      get("region"),
      unless(
        isEmpty,
        tap((region) =>
          pipe([
            () => `configure set region ${region} --profile ${profile}`,
            awsExecCommand(),
          ])()
        )
      ),
    ])(),
]);
const execAwsConfigure = ({ profile = "default" }) =>
  pipe([
    tap((params) => {
      console.log(
        "Create and retrieve the AWS Access Key ID and AWS Secret Access Key by visiting the following page:"
      );
    }),
    () => ({
      type: "confirm",
      name: "confirmOpen",
      message: `Open https://console.aws.amazon.com/iam/home#/security_credentials`,
      initial: true,
    }),
    myPrompts,
    tap.if(get("confirmOpen"), () => {
      shell.exec(
        "open https://console.aws.amazon.com/iam/home#/security_credentials"
      );
    }),
    assign({
      AWSAccessKeyId: promptAccessKeyId,
    }),
    assign({
      AWSSecretKey: promptSecretKey,
    }),
    tap(({ AWSAccessKeyId, AWSSecretKey }) =>
      pipe([
        tap((params) => {
          assert(AWSAccessKeyId);
          assert(AWSSecretKey);
        }),
        () =>
          `configure set aws_access_key_id ${AWSAccessKeyId} --profile ${profile}`,
        awsExecCommand(),
        () =>
          `configure set aws_secret_access_key ${AWSSecretKey} --profile ${profile}`,
        awsExecCommand({
          displayText: `aws configure set aws_secret_access_key XXXXXXXXXXXXXXX --profile ${profile}`,
        }),
      ])()
    ),
  ]);

const isAuthenticated = ({ profile = "default", regionMain = "us-east-1" }) =>
  pipe([
    () => `sts get-caller-identity --region ${regionMain} --profile ${profile}`,
    tryCatch(
      pipe([
        awsExecCommand({
          textEnd: pipe([
            ({ textStart, result }) =>
              `${textStart}\nAWS Account is ${result.Account}`,
          ]),
        }),
      ]),
      pipe([
        switchCase([
          includes("could not be found"),
          (error) => ({ error }),
          pipe([
            execAwsConfigure({ profile }),
            () => isAuthenticated({ profile }),
          ]),
        ]),
      ])
    ),
  ])();

exports.isAuthenticated = isAuthenticated;

const inferRegionMainFromPartition = pipe([
  switchCase([
    eq(get("partition"), "aws-us-gov"),
    () => "us-gov-west-1",
    eq(get("partition"), "aws-cn"),
    () => "cn-north-1",
    () => "us-east-1",
  ]),
]);

exports.createProjectAws = ({}) =>
  pipe([
    tap(({ dirs }) => {
      dirs.providerDirectory &&
        console.log(
          `Initializing AWS provider in directory: ${dirs.providerDirectory}`
        );
    }),

    tap(isAwsPresent),
    assign({ partition: promptPartition }),
    assign({
      regionMain: inferRegionMainFromPartition,
    }),
    assign({ profile: promptProfile }),
    tap(isAuthenticated),
    assign({ region: promptRegion }),
    assign({ config: createConfig }),
    tap((params) => {
      assert(true);
    }),
  ]);
