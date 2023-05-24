const assert = require("assert");
const { EOL } = require("os");
const { pipe, get, tap, assign, eq, map, tryCatch } = require("rubico");
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
const prompts = require("prompts");
const shell = require("shelljs");
const { execCommandShell, createConfig } = require("./createProjectCommon");

const awsExecCommand =
  ({ displayText } = {}) =>
  (command) =>
    pipe([
      () => `aws ${command}`,
      execCommandShell({ transform: append(" --output json"), displayText }),
    ])();

exports.awsExecCommand = awsExecCommand;

const isAwsPresent = tap(
  pipe([
    () => "--version",
    tryCatch(
      pipe([
        awsExecCommand(),
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
  prompts,
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
  prompts,
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

const promptRegion = pipe([
  tap((params) => {
    assert(true);
  }),
  assign({
    regions: pipe([
      ({ profile }) =>
        `ec2 describe-regions --region us-east-1 --profile ${profile}`,
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
      prompts,
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
    prompts,
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

const isAuthenticated = ({ profile = "default" }) =>
  pipe([
    () => `sts get-caller-identity --region us-east-1 --profile ${profile}`,
    tryCatch(
      pipe([
        awsExecCommand(),
        tap((params) => {
          assert(true);
        }),
      ]),
      (error) =>
        pipe([
          tap((params) => {
            assert(error);
          }),
          execAwsConfigure({ profile }),
          () => isAuthenticated({ profile }),
        ])()
    ),
  ])();

exports.isAuthenticated = isAuthenticated;

exports.createProjectAws = ({}) =>
  pipe([
    tap(({ profile, dirs }) => {
      assert(true);
      dirs.providerDirectory &&
        console.log(
          `Initializing AWS provider in directory: ${dirs.providerDirectory}`
        );
      console.log(`Using AWS profile: ${profile}`);
    }),
    tap(isAwsPresent),
    tap(isAuthenticated),
    assign({ region: promptRegion }),
    assign({ config: createConfig }),
    tap((params) => {
      assert(true);
    }),
  ]);
