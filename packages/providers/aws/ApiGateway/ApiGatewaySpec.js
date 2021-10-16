const assert = require("assert");
const { pipe, assign, map, tap, omit } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { compare, omitIfEmpty } = require("@grucloud/core/Common");
const { isOurMinionObject } = require("../AwsCommon");
const { RestApi } = require("./RestApi");
const { Stage } = require("./Stage");
const { DomainName } = require("./DomainName");
const { Authorizer } = require("./Authorizer");
const { ApiKey } = require("./ApiKey");
const { Account } = require("./Account");

const GROUP = "APIGateway";

module.exports = () =>
  map(assign({ group: () => GROUP }))([
    {
      type: "DomainName",
      dependsOn: ["ACM::Certificate"],
      Client: DomainName,
      isOurMinion: ({ live, config }) =>
        isOurMinionObject({ tags: live.tags, config }),
      compare: compare({
        filterTarget: pipe([
          tap((params) => {
            assert(true);
          }),
        ]),
        filterLive: pipe([
          tap((params) => {
            assert(true);
          }),
        ]),
      }),
    },
    {
      type: "Account",
      dependsOn: ["IAM::Role"],
      Client: Account,
      isOurMinion: ({ live, config }) => true,
      compare: compare({
        filterTarget: pipe([
          tap((params) => {
            assert(true);
          }),
          defaultsDeep({
            features: ["UsagePlans"],
          }),
        ]),
        filterLive: pipe([
          tap((params) => {
            assert(true);
          }),
          omit(["throttleSettings", "apiKeyVersion"]),
        ]),
      }),
    },
    {
      type: "ApiKey",
      Client: ApiKey,
      isOurMinion: ({ live, config }) =>
        isOurMinionObject({ tags: live.tags, config }),
      compare: compare({
        filterTarget: pipe([
          tap((params) => {
            assert(true);
          }),
        ]),
        filterLive: pipe([
          tap((params) => {
            assert(true);
          }),
          omit(["id", "createdDate", "lastUpdatedDate", "stageKeys"]),
        ]),
      }),
    },
    {
      type: "RestApi",
      Client: RestApi,
      isOurMinion: ({ live, config }) =>
        isOurMinionObject({ tags: live.tags, config }),
      compare: compare({
        filterTarget: pipe([
          tap((params) => {
            assert(true);
          }),
          omit(["schemaFile", "deployment"]),
          defaultsDeep({ disableExecuteApiEndpoint: false }),
        ]),
        filterLive: pipe([
          tap((params) => {
            assert(true);
          }),
          omit(["id", "createdDate", "deployments", "version"]),
        ]),
      }),
    },
    {
      type: "Stage",
      dependsOn: ["APIGateway::RestApi"],
      Client: Stage,
      isOurMinion: ({ live, config }) =>
        isOurMinionObject({ tags: live.tags, config }),
      compare: compare({
        filterTarget: pipe([
          tap((params) => {
            assert(true);
          }),
          defaultsDeep({ cacheClusterEnabled: false, tracingEnabled: false }),
          omit(["deploymentId"]),
        ]),
        filterLive: pipe([
          tap((params) => {
            assert(true);
          }),
          omit([
            "deploymentId",
            "clientCertificateId",
            "createdDate",
            "lastUpdatedDate",
            "cacheClusterStatus",
          ]),
          omitIfEmpty(["methodSettings"]),
        ]),
      }),
    },
    {
      type: "Authorizer",
      dependsOn: ["APIGateway::RestApi"],
      Client: Authorizer,
      isOurMinion: ({ live, config }) =>
        isOurMinionObject({ tags: live.tags, config }),
      compare: compare({
        filterTarget: pipe([
          tap((params) => {
            assert(true);
          }),
        ]),
        filterLive: pipe([
          tap((params) => {
            assert(true);
          }),
        ]),
      }),
    },
  ]);
