STACK_NAME=appmesh-workshop
aws cloudformation describe-stacks \
  --stack-name "$STACK_NAME" | \
jq -r '[.Stacks[0].Outputs[] | 
    {key: .OutputKey, value: .OutputValue}] | from_entries' > cfn-output.json
