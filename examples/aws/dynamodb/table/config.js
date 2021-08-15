module.exports = ({ stage }) => ({
  projectName: "example-grucloud-dynamodb-table",
  dynamoDB: {
    Table: {
      myModelTypeDemoTable: {
        name: "MyModelTypeDemoTable",
        properties: {
          AttributeDefinitions: [
            {
              AttributeName: "id",
              AttributeType: "S",
            },
          ],
          KeySchema: [
            {
              AttributeName: "id",
              KeyType: "HASH",
            },
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
          },
        },
      },
    },
  },
});
