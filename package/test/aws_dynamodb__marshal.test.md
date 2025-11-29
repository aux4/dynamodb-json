# aux4 aws dynamodb marshal

## marshal simple object

```file:input.json
{"name": "John", "age": 30}
```

```execute
cat input.json | aux4 aws dynamodb marshal
```

```expect
{
  "name": {
    "S": "John"
  },
  "age": {
    "N": "30"
  }
}
```

## marshal object with boolean

```file:input.json
{"active": true, "verified": false}
```

```execute
cat input.json | aux4 aws dynamodb marshal
```

```expect
{
  "active": {
    "BOOL": true
  },
  "verified": {
    "BOOL": false
  }
}
```

## marshal object with null

```file:input.json
{"name": "John", "address": null}
```

```execute
cat input.json | aux4 aws dynamodb marshal
```

```expect
{
  "name": {
    "S": "John"
  },
  "address": {
    "NULL": true
  }
}
```

## marshal object with list

```file:input.json
{"tags": ["aws", "dynamodb", "json"]}
```

```execute
cat input.json | aux4 aws dynamodb marshal
```

```expect
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

## marshal object with nested object

```file:input.json
{"user": {"name": "John", "email": "john@example.com"}}
```

```execute
cat input.json | aux4 aws dynamodb marshal
```

```expect
{
  "user": {
    "M": {
      "name": {
        "S": "John"
      },
      "email": {
        "S": "john@example.com"
      }
    }
  }
}
```

## marshal invalid json

```file:input.json
{invalid json}
```

```execute
cat input.json | aux4 aws dynamodb marshal
```

```error
Invalid JSON input
```
