
openssl aes-256-cbc -md sha256 -e -in secrets/kp.pem -out secrets/kp.pem.enc -k $KEY
openssl aes-256-cbc -md sha256 -e -in examples/multi/config/default.env -out examples/multi/config/default.env.enc -k $KEY
openssl aes-256-cbc -md sha256 -e -in $HOME/.config/gcloud/grucloud.json -out secrets/grucloud.json.enc -k $KEY