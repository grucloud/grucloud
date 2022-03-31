var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};

// codegen/graphql/mutations.ts
var createTodo = `
  mutation CreateTodo($id: ID, $name: String!, $description: String) {
    createTodo(id: $id, name: $name, description: $description) {
      id
      name
      description
      createdAt
      updatedAt
    }
  }
`;

// appsyncRequest.ts
var https = __toModule(require("https"));
var import_url = __toModule(require("url"));
var import_aws_sdk = __toModule(require("aws-sdk"));
var AWS = require("aws-sdk");
var region = process.env.AWS_REGION;
var request2 = (queryDetails, appsyncUrl, apiKey) => {
  const endpoint = new import_url.URL(appsyncUrl).hostname;
  const req = new import_aws_sdk.HttpRequest(new import_aws_sdk.Endpoint(endpoint), region);
  req.method = "POST";
  req.path = "/graphql";
  req.headers.host = endpoint;
  req.headers["Content-Type"] = "application/json";
  req.body = JSON.stringify(queryDetails);
  if (apiKey) {
    req.headers["x-api-key"] = apiKey;
  } else {
    const signer = new AWS.Signers.V4(req, "appsync", true);
    signer.addAuthorization(AWS.config.credentials, AWS.util.date.getDate());
  }
  return new Promise((resolve, reject) => {
    const httpRequest = https.request({ ...req, host: endpoint }, (result) => {
      result.on("data", (data) => {
        resolve(JSON.parse(data.toString()));
      });
    });
    httpRequest.write(req.body);
    httpRequest.end();
  });
};
var appsyncRequest_default = request2;

// main.trigger.ts
var appsyncURL = process.env.GRAPHQL_URL;
exports.handler = async (event) => {
  const variables = {
    name: event.name || "a new todo",
    description: event.description || "with a description"
  };
  const result = await appsyncRequest_default({ query: createTodo, variables }, appsyncURL);
  if (result.errors) {
    return console.log("Errors in mutation", result.errors);
  }
  console.log(result.data);
};
