# aux4 aws dynamodb unmarshal

## unmarshal simple object

```file:input.json
{"name": {"S": "John"}, "age": {"N": "30"}}
```

```execute
cat input.json | aux4 aws dynamodb unmarshal | jq .
```

```expect
{
  "name": "John",
  "age": 30
}
```

## unmarshal object with boolean

```file:input.json
{"active": {"BOOL": true}, "verified": {"BOOL": false}}
```

```execute
cat input.json | aux4 aws dynamodb unmarshal | jq .
```

```expect
{
  "active": true,
  "verified": false
}
```

## unmarshal object with null

```file:input.json
{"name": {"S": "John"}, "address": {"NULL": true}}
```

```execute
cat input.json | aux4 aws dynamodb unmarshal | jq .
```

```expect
{
  "name": "John",
  "address": null
}
```

## unmarshal object with list

```file:input.json
{"tags": {"L": [{"S": "aws"}, {"S": "dynamodb"}, {"S": "json"}]}}
```

```execute
cat input.json | aux4 aws dynamodb unmarshal | jq .
```

```expect
{
  "tags": [
    "aws",
    "dynamodb",
    "json"
  ]
}
```

## unmarshal object with nested object

```file:input.json
{"user": {"M": {"name": {"S": "John"}, "email": {"S": "john@example.com"}}}}
```

```execute
cat input.json | aux4 aws dynamodb unmarshal | jq .
```

```expect
{
  "user": {
    "name": "John",
    "email": "john@example.com"
  }
}
```

## unmarshal with Item wrapper

```file:input.json
{"Item": {"name": {"S": "John"}, "age": {"N": "30"}}}
```

```execute
cat input.json | aux4 aws dynamodb unmarshal | jq .
```

```expect
{
  "name": "John",
  "age": 30
}
```

## unmarshal with Items wrapper (array)

```file:input.json
{"Items": [{"name": {"S": "John"}}, {"name": {"S": "Jane"}}]}
```

```execute
cat input.json | aux4 aws dynamodb unmarshal | jq .
```

```expect
[
  {
    "name": "John"
  },
  {
    "name": "Jane"
  }
]
```

## unmarshal invalid json

```file:input.json
{invalid json}
```

```execute
cat input.json | aux4 aws dynamodb unmarshal
```

```error
Invalid JSON input
```
