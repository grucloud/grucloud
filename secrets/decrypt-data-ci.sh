
# decrypt-data-ci.sh
# run it at the root directory with the command 'npm run decrypt-data-ci'
# This is supposed to be excuted as part of a CI process such CircleCI or Travis

openssl aes-256-cbc -md sha256 -d -out secrets/kp.pem -in secrets/kp.pem.enc -pass pass:$KEY
openssl aes-256-cbc -md sha256 -d -out secrets/default.env -in secrets/default.env.enc -pass pass:$KEY
mkdir -p $HOME/.config/gcloud/
cp secrets/default.env examples/multi/
cp secrets/default.env examples/azure/
cp secrets/default.env examples/scaleway/

openssl aes-256-cbc -md sha256 -d -out $HOME/.config/gcloud/grucloud-e2e.json  -in secrets/grucloud-e2e.json.enc -pass pass:$KEY