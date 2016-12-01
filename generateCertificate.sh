#!/bin/sh

aws iot create-keys-and-certificate \
	--set-as-active \
	--certificate-pem-outfile=./certs/certificate.pem.crt \
	--public-key-outfile=./certs/public.pem.key \
	--private-key-outfile=./certs/private.pem.key > ./certs/certificateAndKeys.json

node -e "console.log(require('./certs/certificateAndKeys.json').certificateArn)" > ./certs/arn.txt