const assert = require("assert");
const { pipe, assign, map, tap } = require("rubico");
const { compare } = require("@grucloud/core/Common");
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
      type: "RestApi",
      Client: RestApi,
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
        ]),
        filterLive: pipe([
          tap((params) => {
            assert(true);
          }),
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
      dependsOn: ["APIGateway::RestApi", "APIGateway::Resource"],
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
