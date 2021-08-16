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
          BillingMode: "PAY_PER_REQUEST",
        },
      },
    },
  },
});
