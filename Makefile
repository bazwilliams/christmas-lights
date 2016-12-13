CERTIFICATE_ARN=`node -e "console.log(require('./certs/certificateAndKeys.json').certificateArn)"`
ROOT_CA=./certs/root-CA.crt
CLOUDFORMATION_PREFIX=it-christmas-tree

PACKAGE := build/release/it-christmas-tree.zip

.PHONY: test clean build

${ROOT_CA}:
	curl -o ${ROOT_CA} https://www.symantec.com/content/en/us/enterprise/verisign/roots/VeriSign-Class%203-Public-Primary-Certification-Authority-G5.pem

${CERTIFICATE_ARN}:
	aws iot create-keys-and-certificate \
		--set-as-active \
		--certificate-pem-outfile=./certs/certificate.pem.crt \
		--public-key-outfile=./certs/public.pem.key \
		--private-key-outfile=./certs/private.pem.key > ./certs/certificateAndKeys.json

test:
	npm test

clean:
	-@rm -fv ${PACKAGE}

build:
	dotnet restore
	dotnet publish server/ChristmasLightsService/src/Service.Lambda/

${PACKAGE}: clean build
	grunt zip:lambda

upload: ${PACKAGE}
	aws s3 cp ${PACKAGE} s3://linn.lambdas/it-christmas-tree.zip

deploy-iot:
	aws cloudformation create-stack \
		--stack-name ${CLOUDFORMATION_PREFIX}-iot \
		--template-body file://./aws/iot.yaml \
		--parameters \
			ParameterKey=ThingName,ParameterValue=${THING_NAME} \
			ParameterKey=Certificate,ParameterValue=${CERTIFICATE_ARN}

deploy-lambda:
	aws cloudformation create-stack \
		--stack-name ${CLOUDFORMATION_PREFIX}-lambda \
		--template-body file://./aws/lambda.yaml \
		--capabilities=CAPABILITY_IAM \
		--parameters \
			ParameterKey=ThingName,ParameterValue=${THING_NAME} \
			ParameterKey=IotServiceUrl,ParameterValue=${IOT_SERVICE_URL} \
			ParameterKey=IotButton,ParameterValue=${IOT_BUTTON}

deploy: deploy-iot deploy-lambda
