const createResources = ({ provider }) => {
  provider.DynamoDB.makeTable({
    name: "myTable",
    properties: () => ({
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
        ReadCapacityUnits: 6,
        WriteCapacityUnits: 6,
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
