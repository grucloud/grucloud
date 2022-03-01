exports.findDependenciesGraphqlApi = ({ live, lives }) => ({
  type: "GraphqlApi",
  group: "AppSync",
  ids: [live.apiId],
});
