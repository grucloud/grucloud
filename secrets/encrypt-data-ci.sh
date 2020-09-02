
openssl aes-256-cbc -e -in secrets/kp.pem -out secrets/kp.pen.enc -k $KEY
openssl aes-256-cbc -e -in examples/multi/config/default.env -out examples/multi/config/default.env.enc -k $KEY
openssl aes-256-cbc -e -in examples/multi/config/grucloud-e2e-f35e5f0a014a.json -out examples/multi/config/grucloud-e2e-f35e5f0a014a.json.enc -k $KEY