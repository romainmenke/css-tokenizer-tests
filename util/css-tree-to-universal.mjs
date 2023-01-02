import { tokenNames } from 'css-tree/tokenizer';
import { ident, string } from 'css-tree';

export function csstreeToUniversal(token, source) {
	const tokenType = tokenNameToUniversal(tokenNames[token[0]]);

	let structured = null;
	if (tokenType === 'ident-token') {
		structured = {
			value: ident.decode(source.slice(token[1], token[2]))
		}
	}

	if (tokenType === 'at-keyword-token') {
		structured = {
			value: ident.decode(source.slice(token[1] + 1, token[2]))
		}
	}

	if (tokenType === 'hash-token') {
		structured = {
			value: ident.decode(source.slice(token[1] + 1, token[2])),
			type: 'unrestricted',
		}
	}

	if (tokenType === 'string-token') {
		structured = {
			value: string.decode(source.slice(token[1], token[2])),
		}
	}

	if (tokenType === 'delim-token') {
		structured = {
			value: source.slice(token[1], token[2]),
		}
	}

	return {
		type: tokenType,
		raw: source.slice(token[1], token[2]),
		startIndex: token[1],
		endIndex: token[2],
		structured: structured
	}
}

const nameMapping = {
	'(-token': '(-token',
	')-token': ')-token',
	'CDC-token': 'CDC-token',
	'CDO-token': 'CDO-token',
	'EOF-token': 'EOF-token',
	'[-token': '[-token',
	']-token': ']-token',
	'at-keyword-token': 'at-keyword-token',
	'bad-string-token': 'bad-string-token',
	'bad-url-token': 'bad-url-token',
	'colon-token': 'colon-token',
	'comma-token': 'comma-token',
	'delim-token': 'delim-token',
	'dimension-token': 'dimension-token',
	'function-token': 'function-token',
	'hash-token': 'hash-token',
	'ident-token': 'ident-token',
	'number-token': 'number-token',
	'percentage-token': 'percentage-token',
	'semicolon-token': 'semicolon-token',
	'string-token': 'string-token',
	'url-token': 'url-token',
	'whitespace-token': 'whitespace-token',
	'{-token': '{-token',
	'}-token': '}-token',
}

function tokenNameToUniversal(name) {
	return nameMapping[name]
}
