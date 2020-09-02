
openssl aes-256-cbc -d -out secrets/kp.pem -in secrets/kp.pen.enc -k $KEY
openssl aes-256-cbc -d -out examples/multi/config/default.env -in examples/multi/config/default.env.enc -k $KEY
openssl aes-256-cbc -d -out examples/multi/config/grucloud-e2e-f35e5f0a014a.json -in examples/multi/config/grucloud-e2e-f35e5f0a014a.json.enc -k $KEY