Converts JSON read from standard input into the AWS DynamoDB attribute-value format and writes the result to stdout. The command maps JavaScript/JSON types to DynamoDB attribute types: strings become {"S": "..."}, numbers become {"N": "..."} (number represented as a string), booleans become {"BOOL": true|false}, null becomes {"NULL": true}, arrays become {"L": [ ... ]} with each element recursively marshalled, and objects become {"M": { ... }} with their properties recursively marshalled. The command expects valid JSON on stdin and is intended to be used in a pipeline.

The marshaller preserves the JSON structure while wrapping each value in the appropriate DynamoDB type descriptor. Numeric values are converted to their string representation inside the N type as required by DynamoDB. Complex nested structures (arrays of objects, objects containing arrays, etc.) are handled recursively.

If the input is not valid JSON the command emits a simple error message: "Invalid JSON input" and exits with a failure status. Use this command when you need to send items to DynamoDB APIs or SDKs that expect the attribute-value format.

### Example: Simple object
Demonstrates marshalling a basic object with a string and a number.

```file:input.json
{"name": "John", "age": 30}
```

```bash
cat input.json | aux4 aws dynamodb marshal
```

```json
{
  "name": {
    "S": "John"
  },
  "age": {
    "N": "30"
  }
}
```

### Example: Lists and nested objects
Shows how arrays and nested objects are converted.

```file:input.json
{"tags": ["aws", "dynamodb"], "user": {"name": "John", "email": "john@example.com"}}
```

```bash
cat input.json | aux4 aws dynamodb marshal
```

```json
{
  "tags": {
    "L": [
      { "S": "aws" },
      { "S": "dynamodb" }
    ]
  },
  "user": {
    "M": {
      "name": { "S": "John" },
      "email": { "S": "john@example.com" }
    }
  }
}
```

For the inverse operation (convert DynamoDB attribute-value objects back to plain JSON), see the related command: [aux4 aws dynamodb unmarshal](./unmarshal).