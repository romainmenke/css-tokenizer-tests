# @rmenke/css-tokenizer-tests

## 1.1.5

Add a test for `string` tokens containing a backslash followed by CRLF.

## 1.1.4

Fix negative zero serialization in test corpus.

## 1.1.3

Move recent tests from the `numeric` category to `number`.

## 1.1.2

Add a test for `.2.7`

## 1.1.1

Add a test for `1e+`

## 1.1.0

Add `signCharacter` for `number`, `dimension` and `percentage` tokens.
This makes it possible to distinguish between `+10` and `10` or `-0` and `0`.

This value can be either provided by a tokenizer or inferred from the first character of the `raw` value.

```json
{
	"type": "number-token",
	"raw": "+10",
	"startIndex": 0,
	"endIndex": 3,
	"structured": {
		"signCharacter": "+",
		"value": 10,
		"type": "integer"
	}
}
```
