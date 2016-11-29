[![Build Status](https://travis-ci.org/bazwilliams/christmas-lights.svg?branch=master)](https://travis-ci.org/bazwilliams/christmas-lights)

This details the steps to build and run the Linn IT Christmas tree 2016. 

Kit required: 

* Raspberry Pi Zero
* Wifi dongle
* RGB light strip with WS2812 controllers
* Buffer and Line Driver to take 3.3v signal for Pi and switch a WS2812 compatible 5v signal for the WS2812 data channel. We used this: http://uk.rs-online.com/web/p/buffer-line-driver-combinations/7092205/
* External 5v power supply for light strip

Deployment:

1. Obtain a certificate for your Thing and register it with AWS IOT. `./generateCertificate.sh` will create a certificate, private and public key. It will output the Arn of the certificate which you need to reference for the cloudformation stack. You should download the root ca certificate from Amazon. 
2. Store the certificates in the `/certs` folder and the Arn in `/certs/arn.txt`
3. `aws cloudformation create-stack --stack-name it-christmas-tree --template-body file://./aws/cloudformation.yaml --parameters ParameterKey=ThingName,ParameterValue=it-christmas-tree ParameterKey=Certificate,ParameterValue=\`cat certs/arn.txt\``
4. Copy the `defaults.env` file to `.env` and modify as appropriate. 