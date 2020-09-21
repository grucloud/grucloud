
openssl aes-256-cbc -md sha256 -d -out secrets/kp.pem -in secrets/kp.pem.enc -pass pass:$KEY
openssl aes-256-cbc -md sha256 -d -out examples/multi/config/default.env -in examples/multi/config/default.env.enc -pass pass:$KEY
mkdir -p $HOME/.config/gcloud/
openssl aes-256-cbc -md sha256 -d -out $HOME/.config/gcloud/grucloud.json  -in secrets/grucloud.json.enc -pass pass:$KEY