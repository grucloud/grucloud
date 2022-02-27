const assert = require("assert");
const { pipe, get, tap, assign, eq, map, tryCatch } = require("rubico");
const {
  append,
  isEmpty,
  findIndex,
  when,
  includes,
  callProp,
  first,
  identity,
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

const isAwsPresent = pipe([
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
]);

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
      () => "ec2 describe-regions --region us-east-1",
      awsExecCommand(),
      get("Regions"),
    ]),
  }),
  assign({
    currentRegion: tryCatch(
      pipe([
        () => "configure get region",
        awsExecCommand(),
        callProp("split", "\n"),
        first,
        when(includes("undefined"), () => undefined),
      ]),
      () => undefined
    ),
  }),
  tap((params) => {
    assert(true);
  }),
  ({ regions, currentRegion }) =>
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
    ])(),
  tap((region) => {
    assert(region);
  }),
  tap((region) =>
    pipe([() => `configure set region ${region}`, awsExecCommand()])()
  ),
]);

const execAwsConfigure = pipe([
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
      () => `configure set aws_access_key_id ${AWSAccessKeyId}`,
      awsExecCommand(),
      () => `configure set aws_secret_access_key ${AWSSecretKey}`,
      awsExecCommand({
        displayText: "aws configure set aws_secret_access_key XXXXXXXXXXXXXXX",
      }),
    ])()
  ),
]);

const isAuthenticated = pipe([
  () => "sts get-caller-identity --region us-east-1",
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
        execAwsConfigure,
        isAuthenticated,
      ])()
  ),
]);

exports.createProjectAws = pipe([
  tap((params) => {
    assert(true);
  }),
  tap(isAwsPresent),
  tap(isAuthenticated),
  assign({ region: promptRegion }),
  assign({ config: createConfig }),
  tap((params) => {
    assert(true);
  }),
]);
