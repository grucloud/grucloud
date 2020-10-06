
openssl aes-256-cbc -md sha256 -d -out secrets/kp.pem -in secrets/kp.pem.enc -pass pass:$KEY
openssl aes-256-cbc -md sha256 -d -out secrets/default.env -in secrets/default.env.enc -pass pass:$KEY
mkdir -p $HOME/.config/gcloud/
cp secrets/default.env examples/multi/config/
cp secrets/default.env examples/azure/config/
openssl aes-256-cbc -md sha256 -d -out $HOME/.config/gcloud/grucloud.json  -in secrets/grucloud.json.enc -pass pass:$KEY