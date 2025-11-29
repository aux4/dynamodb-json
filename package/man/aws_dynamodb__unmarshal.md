Reads DynamoDB attribute-value JSON from standard input and writes the equivalent plain JavaScript/JSON value to stdout. The command accepts either a single attribute-value map or an array of maps; it also understands the common DynamoDB wrappers `Item` (single item) and `Items` (array of items) and will unwrap them automatically. Values are converted as follows: `S` → string, `N` → number (or BigInt when the value is outside JavaScript's safe integer range), `BOOL` → boolean, `NULL` → null, `L` → array (elements converted recursively), and `M` → object (properties converted recursively). Set types (`SS`, `NS`, `BS`) are converted into JavaScript Set instances of the appropriate native values.

The command is intended for use in pipelines: provide DynamoDB-formatted JSON on stdin and read the human-friendly JSON on stdout. If the input is not valid JSON the command prints the message "Invalid JSON input" and exits with a failure status. This makes it safe to use the tool in scripts where malformed input should halt the pipeline.

Related command: [aux4 aws dynamodb marshal](./marshal)

### Example: Simple object
A single item where strings and numbers are converted to native types.

```file:input.json
{"name": {"S": "John"}, "age": {"N": "30"}}
```

```bash
cat input.json | aux4 aws dynamodb unmarshal
```

```json
{
  "name": "John",
  "age": 30
}
```

### Example: Array of items (Items wrapper)
If the input contains an `Items` array the command returns a JSON array of unmarshalled objects.

```file:input.json
{"Items": [{"name": {"S": "John"}}, {"name": {"S": "Jane"}}]}
```

```bash
cat input.json | aux4 aws dynamodb unmarshal
```

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

### Example: Invalid JSON
When the input cannot be parsed as JSON the command emits a short error message and exits with a non-zero status.

```file:input.json
{invalid json}
```

```bash
cat input.json | aux4 aws dynamodb unmarshal
```

```text
Invalid JSON input
```