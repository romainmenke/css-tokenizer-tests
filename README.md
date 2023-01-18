# CSS Tokenizer Tests

[<img alt="npm version" src="https://img.shields.io/npm/v/@rmenke/css-tokenizer-tests.svg" height="20">](https://www.npmjs.com/package/@rmenke/css-tokenizer-tests)

Tokenizing CSS is non-trivial and some packages might choose to deviate from the specification.
This library is not intended to rank tokenizers.

_I can not stress enough that this is comparing apples to oranges. Different tokenizers are build for different purposes._
_Some do not track source offsets, others do not expose parsed/unescaped values._

It is intended to make it easier to find and resolve issues when that is desirable.

It is also a corpus of CSS that can be used to build a comprehensive test suite for your tokenizer.

-----

## Test Corpus format :

```js
import { testCorpus } from '@rmenke/css-tokenizer-tests';

// A specific test case.
const testCase = testCorpus['tests/at-keyword/0001'];

// The CSS source for a test case.
const cssSource = testCase.css;

// The reference tokens for the test case.
const tokens = testCase.tokens;

// Iterate all test cases.
for (const aTestCaseName in testCorpus) {
	const aTestCase = testCorpus[aTestCaseName];
}
```

## Tokens format :

This test corpus strictly follows the CSS specification.
The token type names are taken directly from the specification.

- `type` is the token type name
- `raw` is the literal representation of the token in the CSS source.
- `startIndex` and `endIndex` are the index of the first and last character in the CSS source.
- `structured` contains extracted data. (numeric values for `number-token`, unescaped `ident` names, ...)

```json
{
	"type": "at-keyword-token",
	"raw": "@foo",
	"startIndex": 0,
	"endIndex": 4,
	"structured": {
		"value": "foo"
	}
}
```

The CSS specification does not require tokenizers to expose this exact interface or the values therein.
This is intended as data to verify that a tokenizer works as expected, nothing more.

You choose which bits you want to compare and how.
This is also why this package is not a test framework.
