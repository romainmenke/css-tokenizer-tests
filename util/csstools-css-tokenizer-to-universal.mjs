export function csstoolsCSSTokenizerToUniversal(token) {
	return {
		type: tokenNameToUniversal(token[0]),
		raw: token[1],
		startIndex: token[2],
		endIndex: token[3] + 1,
		structured: token[4] ?? null
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
	'comment': 'comment',
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
