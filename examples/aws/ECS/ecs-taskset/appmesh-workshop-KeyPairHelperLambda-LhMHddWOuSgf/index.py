import boto3
import cfnresponse
def handler(event, context):
  ec2 = boto3.client('ec2')
  ssm = boto3.client('ssm')

  data = {}

  keyname = event['ResourceProperties']['KeyName']
  keyid = event['ResourceProperties']['KeyId']

  paramName = '/appmeshworkshop/keypair/{}'.format(keyname)

  try:

    if (event["RequestType"] == 'Delete'):
      ssm.delete_parameter(Name = paramName)
      ec2.delete_key_pair(KeyName=keyname)
      cfnresponse.send(event, context, cfnresponse.SUCCESS, data)

    if (event["RequestType"] == 'Create'):
      response = ec2.create_key_pair(KeyName=keyname)
      ssm.put_parameter(
        Name = paramName,
        Value = response['KeyMaterial'],
        Type = 'SecureString',
        KeyId = keyid,
        Overwrite = True
      )
      data['Name'] = keyname
      cfnresponse.send(event, context, cfnresponse.SUCCESS, data)

  except Exception as e:
    errorMessage = e.response['Error']['Message']
    data['Message'] = errorMessage
    cfnresponse.send(event, context, cfnresponse.FAILED, data)
