PACKAGE := build/release/it-christmas-tree.zip

.PHONY: test clean build

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
	aws cloudformation create-stack --stack-name it-christmas-tree --template-body file://./aws/cloudformation.yaml --parameters ParameterKey=ThingName,ParameterValue=it-christmas-tree ParameterKey=Certificate,ParameterValue=${CERTIFICATE_ARN}

deploy-lambda:
	aws cloudformation create-stack --stack-name it-christmas-tree-lambda --template-body file://./aws/lambda.yaml --capabilities=CAPABILITY_IAM

deploy: deploy-iot deploy-lambda
