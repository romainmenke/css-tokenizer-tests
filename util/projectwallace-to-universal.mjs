const typeMapping = {
	1: 'ident-token',
	2: 'function-token',
	3: 'at-keyword-token',
	4: 'hash-token',
	5: 'string-token',
	6: 'bad-string-token',
	7: 'url-token',
	8: 'bad-url-token',
	9: 'delim-token',
	10: 'number-token',
	11: 'percentage-token',
	12: 'dimension-token',
	13: 'whitespace-token',
	14: 'CDO-token',
	15: 'CDC-token',
	16: 'colon-token',
	17: 'semicolon-token',
	18: 'comma-token',
	19: '[-token',
	20: ']-token',
	21: '(-token',
	22: ')-token',
	23: '{-token',
	24: '}-token',
	25: 'comment',
	26: 'EOF-token',
	27: 'unicode-range-token',
};

export function projectwallaceToUniversal(token, source) {
	return {
		type: typeMapping[token.type],
		raw: source.slice(token.start, token.end),
		startIndex: token.start,
		endIndex: token.end,
		structured: null,
	};
}
