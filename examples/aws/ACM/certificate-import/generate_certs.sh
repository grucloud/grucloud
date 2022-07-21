#!/bin/bash

echo "Enter directory name"
read folder
if [ -d "$folder" ] 
then
  echo "Directory exists"
else
  echo -e "mkdir ~/$folder/"
  `mkdir ~/$folder`
fi

echo $folder

echo -e "git clone https://github.com/OpenVPN/easy-rsa.git --depth 1"
git clone https://github.com/OpenVPN/easy-rsa.git --depth 1

echo -e "cd easy-rsa/easyrsa3"
cd easy-rsa/easyrsa3

pwd

echo -e "./easyrsa init-pki"
./easyrsa init-pki

echo -e "./easyrsa build-ca nopass"
./easyrsa build-ca nopass

echo -e "./easyrsa build-server-full server nopass"
./easyrsa build-server-full server nopass

echo -e "./easyrsa build-client-full client1.domain.tld nopass"
./easyrsa build-client-full client1.domain.tld nopass

echo -e "cp pki/ca.crt ~/$folder/"
cp pki/ca.crt ~/$folder/

echo -e "cp pki/issued/server.crt ~/$folder/"
cp pki/issued/server.crt ~/$folder/

echo -e "cp pki/private/server.key ~/$folder/"
cp pki/private/server.key ~/$folder/

echo -e "cp pki/issued/client1.domain.tld.crt ~/$folder"
cp pki/issued/client1.domain.tld.crt ~/$folder

echo -e "cp pki/private/client1.domain.tld.key ~/$folder/"
cp pki/private/client1.domain.tld.key ~/$folder/

echo -e "cd ~/$folder/"
cd ~/$folder/
exec bash


