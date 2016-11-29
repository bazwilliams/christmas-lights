#!/bin/sh

aws iot create-keys-and-certificate \
	--set-as-active \
	--certificate-pem-outfile=./certs/certificate.pem.crt \
	--public-key-outfile=./certs/public.pem.key \
	--private-key-outfile=./certs/private.pem.key