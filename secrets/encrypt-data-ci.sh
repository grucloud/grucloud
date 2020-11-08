
openssl aes-256-cbc -md sha256 -e -in secrets/kp.pem -out secrets/kp.pem.enc -k $KEY
openssl aes-256-cbc -md sha256 -e -in secrets/default.env -out secrets/default.env.enc -k $KEY
openssl aes-256-cbc -md sha256 -e -in $HOME/.config/gcloud/grucloud-e2e.json -out secrets/grucloud-e2e.json.enc -k $KEY