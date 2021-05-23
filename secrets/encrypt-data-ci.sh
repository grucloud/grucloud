
openssl aes-256-cbc -md sha256 -e -in secrets/kp.pem -out secrets/kp.pem.enc -k $KEY
openssl aes-256-cbc -md sha256 -e -in secrets/default.env -out secrets/default.env.enc -k $KEY
openssl aes-256-cbc -md sha256 -e -in $HOME/.config/gcloud/grucloud-test.json -out secrets/grucloud-test.json.enc -k $KEY