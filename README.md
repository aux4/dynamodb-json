# dynamodb-json
Marshall/Unmarshall DynamoDB JSON using CLI

## Install

```
npm install --global dynamodb-json
```

## Usage

### Unmarshall
Converts DynamoDB JSON to regular JSON

```
aws dynamodb scan --table-name table | dynamodb-json unmarshall
```

### Marshall
Converts regular JSON to DynamoDB JSON

```
cat regular.json | dynamodb-json marshall > output.json
```
