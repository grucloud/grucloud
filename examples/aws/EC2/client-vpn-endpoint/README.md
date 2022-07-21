# Client Vpn Endpoint


Here are the instructions to create the root CA, server, and client certificate and keys:

```sh
git clone https://github.com/OpenVPN/easy-rsa.git
cd easy-rsa/easyrsa3
./easyrsa init-pki
./easyrsa build-ca nopass
./easyrsa build-server-full server nopass
./easyrsa build-client-full client1.vpn.tld nopass
```

