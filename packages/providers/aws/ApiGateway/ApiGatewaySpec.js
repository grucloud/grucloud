const assert = require("assert");
const { paramCase } = require("change-case");
const path = require("path");
const { pipe, assign, map, tap, omit } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { compare, omitIfEmpty } = require("@grucloud/core/Common");
const { isOurMinionObject } = require("../AwsCommon");
const { RestApi } = require("./RestApi");
const { Stage } = require("./Stage");
const { Deployment } = require("./Deployment");
const { Integration } = require("./Integration");
const { DomainName } = require("./DomainName");
const { Authorizer } = require("./Authorizer");
const { Model } = require("./Model");
const { Resource } = require("./Resource");
const { Method } = require("./Method");
const { ApiKey } = require("./ApiKey");

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
          omit(["schemaFile"]),
        ]),
        filterLive: pipe([
          tap((params) => {
            assert(true);
          }),
          omit(["id", "createdDate"]),
        ]),
      }),
      addDependencies: ({ provider, resourceName, properties }) =>
        pipe([
          tap((params) => {
            assert(provider);
            assert(properties);
            assert(resourceName);
          }),
          () =>
            provider.S3.makeBucket({
              name: `gc-${paramCase(provider.getConfig().projectName)}`,
            }),
          (bucket) =>
            provider.S3.makeObject({
              name: `${resourceName}.swagger.json`,
              dependencies: () => ({ bucket }),
              properties: () => ({
                ContentType: "application/json",
                source: path.resolve(`${resourceName}.swagger.json`),
              }),
            }),
        ])(),
    },
    {
      type: "Model",
      dependsOn: ["APIGateway::RestApi"],
      Client: Model,
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
      type: "Resource",
      dependsOn: ["APIGateway::RestApi", "APIGateway:Model"],
      Client: Resource,
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
    {
      type: "Method",
      dependsOn: [
        "APIGateway::RestApi",
        "APIGateway::Resource",
        "APIGateway::Model",
      ],
      Client: Method,
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
      type: "Integration",
      dependsOn: [
        "APIGateway::RestApi",
        "APIGateway::Resource",
        "APIGateway::Method",
        "Lambda::Function",
      ],
      Client: Integration,
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
      type: "Deployment",
      dependsOn: [
        "APIGateway::RestApi",
        "APIGateway::Resource",
        "APIGateway::Model",
        "APIGateway::Method",
        "APIGateway::Integration",
      ],
      Client: Deployment,
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
