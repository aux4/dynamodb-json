# community/aws-dynamodb-marshaller

Commands to marshal and unmarshal JSON to/from AWS DynamoDB format

This package provides small, focused aux4 commands to convert plain JSON into the AWS DynamoDB wire-format (attribute-value map) and to convert DynamoDB attribute-value maps back into plain JSON. It's useful for preparing data for PutItem/UpdateItem calls, inspecting DynamoDB responses, or transforming fixtures for testing.

The commands fit into the aux4 ecosystem as a lightweight utility package that can be piped into from other tools or used in scripts. Benefits include simple stdin/stdout usage, predictable conversions for common JSON types (strings, numbers, booleans, nulls, lists, maps), and fast integration into existing aux4 workflows.

## Installation

```bash
aux4 install community/aws-dynamodb-marshaller
```

## System Dependencies

This package requires system dependencies. You need to have one of the following system installers:

- [brew](/r/public/packages/aux4/system-installer-brew)
- [apt](/r/public/packages/aux4/system-installer-apt)
- [linux](/r/public/packages/aux4/system-installer-linux)

For more details, see [system-installer](/r/public/packages/aux4/pkger/commands/aux4/pkger/system).

## Quick Start

The most common use case is piping a JSON document into the marshal command to produce a DynamoDB attribute-value map:

```bash
cat input.json | aux4 aws dynamodb marshal
```

This reads JSON from stdin and writes the DynamoDB-format object to stdout, converting strings to {"S": "..."}, numbers to {"N": "..."}, booleans to {"BOOL": ...}, nulls to {"NULL": true}, arrays to {"L": [...]}, and objects to {"M": {...}}.

## Marshal JSON to DynamoDB format

Convert ordinary JSON documents into the DynamoDB attribute-value representation so they can be used with DynamoDB SDK operations or stored as fixtures.

The marshal command reads JSON from stdin and writes the converted DynamoDB map to stdout. It handles nested objects and arrays and maps primitive types to the corresponding DynamoDB types.

```bash
aux4 aws dynamodb marshal
```

For command-specific help see [`aux4 aws dynamodb marshal`](./commands/aws/dynamodb/marshal).

## Unmarshal DynamoDB format to JSON

Convert DynamoDB attribute-value maps back into plain JSON. This is helpful when inspecting responses from DynamoDB (GetItem, Query, Scan) or when converting stored fixtures back into normal JSON.

The unmarshal command reads DynamoDB-formatted JSON from stdin and writes plain JSON to stdout. It will also unwrap top-level Item and Items wrappers commonly returned by SDK calls.

```bash
aux4 aws dynamodb unmarshal
```

For command-specific help see [`aux4 aws dynamodb unmarshal`](./commands/aws/dynamodb/unmarshal).

## Examples

### Scan a DynamoDB table

Scan all items from a table and convert the response to plain JSON:

```bash
aws dynamodb scan --table-name users | aux4 aws dynamodb unmarshal
```

### Query a DynamoDB table

Query items by partition key and unmarshal the results:

```bash
aws dynamodb query \
  --table-name orders \
  --key-condition-expression "userId = :uid" \
  --expression-attribute-values '{":uid": {"S": "user123"}}' \
  | aux4 aws dynamodb unmarshal
```

### Get a single item

Retrieve a specific item and convert it to plain JSON:

```bash
aws dynamodb get-item \
  --table-name users \
  --key '{"id": {"S": "user123"}}' \
  | aux4 aws dynamodb unmarshal
```

### Put an item into DynamoDB

Marshal a JSON object and use it with put-item:

```bash
echo '{"id": "user123", "name": "John Doe", "age": 30}' \
  | aux4 aws dynamodb marshal > item.json

aws dynamodb put-item --table-name users --item file://item.json
```

### Marshal from a JSON file

Convert a JSON file to DynamoDB format:

```bash
cat user.json | aux4 aws dynamodb marshal > dynamodb-item.json
aws dynamodb put-item --table-name users --item file://dynamodb-item.json
```

### Marshal an object with a list

This example converts a JSON array into a DynamoDB list of attribute-value items.

input.json:
```json
{"tags": ["aws", "dynamodb", "json"]}
```

Run:

```bash
cat input.json | aux4 aws dynamodb marshal
```

The output represents the array as an "L" value with nested "S" items:

```json
{
  "tags": {
    "L": [
      {
        "S": "aws"
      },
      {
        "S": "dynamodb"
      },
      {
        "S": "json"
      }
    ]
  }
}
```

### Unmarshal a DynamoDB Item wrapper

DynamoDB SDK responses sometimes wrap a single item with an "Item" key. The unmarshal command will unwrap and convert it to plain JSON.

input.json:
```json
{"Item": {"name": {"S": "John"}, "age": {"N": "30"}}}
```

Run:

```bash
cat input.json | aux4 aws dynamodb unmarshal
```

The result is the plain JSON object:

```json
{
  "name": "John",
  "age": 30
}
```

### Unmarshal multiple Items (array)

When a response contains "Items" (an array of attribute-value maps), unmarshal will convert each entry into plain JSON and return a JSON array.

input.json:
```json
{"Items": [{"name": {"S": "John"}}, {"name": {"S": "Jane"}}]}
```

Run:

```bash
cat input.json | aux4 aws dynamodb unmarshal
```

The output is a JSON array of the unmarshalled objects:

```json
[
  {
    "name": "John"
  },
  {
    "name": "Jane"
  }
]
```

### Unmarshal nested objects and booleans

DynamoDB nested maps and boolean values are converted back into native JSON maps and booleans.

input.json:
```json
{"user": {"M": {"name": {"S": "John"}, "email": {"S": "john@example.com"}}}, "active": {"BOOL": true}}
```

Run:

```bash
cat input.json | aux4 aws dynamodb unmarshal
```

The output flattens the nested map and converts the boolean:

```json
{
  "user": {
    "name": "John",
    "email": "john@example.com"
  },
  "active": true
}
```

## Troubleshooting

If the command receives malformed JSON on stdin it will report an error such as "Invalid JSON input". Ensure the input is valid JSON before piping it into the command.

## License

This package does not specify a license. See [LICENSE](./license) for details.
