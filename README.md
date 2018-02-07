# Stock demo

A simple stock management system using AWS Lambda + DynamoDB (with Serverless Application Model).

## Prerequisite

* AWS cli ([link](http://docs.aws.amazon.com/fr_fr/cli/latest/userguide/installing.html))

Optionnal (to run localy)
* SAM local ([link](https://github.com/awslabs/aws-sam-local#installation))
* JDK + DynamoDB local ([link](http://docs.aws.amazon.com/fr_fr/amazondynamodb/latest/developerguide/DynamoDBLocal.html))


## Installation

```
aws s3 mb s3://<BUCKET_NAME>
sam package --template-file template.yml --output-template-file output.yml --s3-bucket <BUCKET_NAME>
sam deploy --template-file output.yml --capabilities CAPABILITY_IAM --stack-name <STACK_NAME>
```

## Run and test localy

```
# Run once
nohup java -jar ~/tiller/dynamodb_local/DynamoDBLocal.jar --inMemory -sharedDb &

# Create tables
aws dynamodb create-table --table-name StockEvent  --attribute-definitions AttributeName=uuid,AttributeType=S --key-schema AttributeName=uuid,KeyType=HASH --provisioned-throughput ReadCapacityUnits=2,WriteCapacityUnits=2 --stream-specification StreamEnabled=true,StreamViewType=NEW_IMAGE --endpoint-url http://localhost:8000
aws dynamodb create-table --table-name StockReadModel --attribute-definitions AttributeName=productId,AttributeType=N --key-schema AttributeName=productId,KeyType=HASH --provisioned-throughput ReadCapacityUnits=2,WriteCapacityUnits=2 --endpoint-url http://localhost:8000

# Run functions
STREAM_ARN=$(aws dynamodb --endpoint-url http://localhost:8000 describe-table --table-name StockEvent | grep LatestStreamArn | awk '{ print substr($2, 2, length($2) - 2); }'); SHARD_ID=$(aws dynamodbstreams --endpoint-url http://localhost:8000 describe-stream --stream-arn $STREAM_ARN | grep ShardId | awk '{ print substr($2, 2, length($2) - 3); }'); SHARD_ITERATOR=$(aws dynamodbstreams --endpoint-url http://localhost:8000 get-shard-iterator --stream-arn $STREAM_ARN --shard-id $SHARD_ID --shard-iterator-type LATEST | grep ShardIterator | awk '{ print substr($2, 2, length($2) - 2); }')

# Product Received
sam local invoke ReceivedFunction --event misc/received.json --env-vars misc/local.json
aws dynamodbstreams --endpoint-url http://localhost:8000 get-records --shard-iterator $SHARD_ITERATOR | sam local invoke StockEventListenerFunction --env-vars misc/local.json
sam local invoke GetStockFunction --event misc/getStock.json --env-vars misc/local.json

# Product Consumed
sam local invoke ConsumedFunction --event misc/consumed.json --env-vars misc/local.json
aws dynamodbstreams --endpoint-url http://localhost:8000 get-records --shard-iterator $SHARD_ITERATOR | sam local invoke StockEventListenerFunction --env-vars misc/local.json
sam local invoke GetStockFunction --event misc/getStock.json --env-vars misc/local.json

# Last line should look like this: 
# {"statusCode":200,"body":"{\"quantity\":9,\"productId\":1,\"in\":10,\"out\":1}","headers":{"Content-Type":"application/json"}}
```
