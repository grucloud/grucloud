module.exports = ({ stage }) => ({
  projectName: "example-grucloud-dynamodb-table",
  dynamoDB: {
    Table: {
      myTable: {
        name: "myTable",
        properties: {
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
        },
      },
    },
  },
});
