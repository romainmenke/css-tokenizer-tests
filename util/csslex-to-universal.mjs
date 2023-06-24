import { types, value } from "csslex";

export function cssLexToUniversal(token, source) {
	const tokenValue = value(source, token);
	const tokenType = typeMapping[token[0]] ?? token[0];

	let structured = null;
	if (tokenType === 'comment') {
		structured = null;
	} else if (tokenType === 'percentage-token') {
		structured = {
			value: tokenValue.value
		};
	} else if (typeof tokenValue !== "object") {
		structured = {
			value: tokenValue
		};
	} else {
		structured = tokenValue;
	}

	return {
		type: tokenType,
		raw: source.slice(token[1], token[2]),
		startIndex: token[1],
		endIndex: token[2],
		structured: (typeof tokenValue === 'string') ? { value: tokenValue } : tokenValue,
	}
}

const typeMapping = {
	[types.LEFT_PAREN]: '(-token',
	[types.RIGHT_PAREN]: ')-token',
	[types.CDC]: 'CDC-token',
	[types.CDO]: 'CDO-token',
	[types.LEFT_SQUARE]: '[-token',
	[types.RIGHT_SQUARE]: ']-token',
	[types.AT_KEYWORD]: 'at-keyword-token',
	[types.BAD_STRING]: 'bad-string-token',
	[types.BAD_URL]: 'bad-url-token',
	[types.COLON]: 'colon-token',
	[types.COMMA]: 'comma-token',
	[types.COMMENT]: 'comment',
	[types.DELIM]: 'delim-token',
	[types.DIMENSION]: 'dimension-token',
	[types.FUNCTION]: 'function-token',
	[types.HASH]: 'hash-token',
	[types.IDENT]: 'ident-token',
	[types.NUMBER]: 'number-token',
	[types.PERCENTAGE]: 'percentage-token',
	[types.SEMICOLON]: 'semicolon-token',
	[types.STRING]: 'string-token',
	[types.URL]: 'url-token',
	[types.WHITESPACE]: 'whitespace-token',
	[types.LEFT_CURLY]: '{-token',
	[types.RIGHT_CURLY]: '}-token',
}
