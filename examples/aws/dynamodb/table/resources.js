const createResources = ({ provider }) => {
  provider.DynamoDB.makeTable({
    name: "myTable",
    properties: ({ config }) => ({
      AttributeDefinitions: [
        {
          AttributeName: "Id",
          AttributeType: "S",
        },
      ],
      KeySchema: [
        {
          AttributeName: "Id",
          KeyType: "HASH",
        },
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5,
      },
      Tags: [
        {
          Key: "TOTOKEY",
          Value: "TOTO",
        },
      ],
    }),
  });
};

exports.createResources = createResources;
