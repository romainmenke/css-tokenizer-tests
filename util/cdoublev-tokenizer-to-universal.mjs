export function cdoublevTokenizerToUniversal(token, source) {
	if (token.types.length !== 1) {
		throw new Error(`Unexpected token types length ${JSON.stringify(token)}`);
	}

	const tokenType = tokenNameToUniversal(token.types[0], token.value);
	let structured = null;
	if (tokenType === 'ident-token') {
		structured = {
			value: token.value
		}
	}

	if (tokenType === 'function-token') {
		structured = {
			value: token.value
		}
	}

	if (tokenType === 'at-keyword-token') {
		structured = {
			value: token.value
		}
	}

	if (tokenType === 'hash-token') {
		structured = {
			value: token.value,
			type: token.type === 'id' ? 'id' : 'unrestricted',
		}
	}

	if (tokenType === 'string-token') {
		structured = {
			value: token.value,
		}
	}

	if (tokenType === 'url-token') {
		structured = {
			value: token.value,
		}
	}

	if (tokenType === 'delim-token') {
		structured = {
			value: token.value,
		}
	}

	if (tokenType === 'percentage-token') {
		structured = {
			value: token.value,
			signCharacter: token.sign,
		}
	}

	if (tokenType === 'number-token') {
		structured = {
			value: token.value,
			signCharacter: token.sign,
			type: token.type,
		}
	}

	if (tokenType === 'dimension-token') {
		structured = {
			value: token.value,
			unit: token.unit,
			signCharacter: token.sign,
			type: token.type,
		}
	}

	if (structured && !structured.signCharacter) {
		delete structured.signCharacter;
	}

	return {
		type: tokenType,
		raw: source.slice(token.start, token.end),
		startIndex: token.start,
		endIndex: token.end,
		structured: structured
	}
}

const nameMapping = {
	'<(-token>': '(-token',
	'<)-token>': ')-token',
	'<CDC-token>': 'CDC-token',
	'<CDO-token>': 'CDO-token',
	'<EOF-token>': 'EOF-token',
	'<[-token>': '[-token',
	'<]-token>': ']-token',
	'<at-keyword-token>': 'at-keyword-token',
	'<bad-string-token>': 'bad-string-token',
	'<bad-url-token>': 'bad-url-token',
	'<colon-token>': 'colon-token',
	'<comma-token>': 'comma-token',
	'<comment>': 'comment',
	'<delimiter-token>': 'delim-token',
	'<dimension-token>': 'dimension-token',
	'<function-token>': 'function-token',
	'<hash-token>': 'hash-token',
	'<ident-token>': 'ident-token',
	'<number-token>': 'number-token',
	'<percentage-token>': 'percentage-token',
	'<semicolon-token>': 'semicolon-token',
	'<string-token>': 'string-token',
	'<url-token>': 'url-token',
	'<whitespace-token>': 'whitespace-token',
	'<{-token>': '{-token',
	'<}-token>': '}-token',
}

function tokenNameToUniversal(name, value) {
	// Delimiter (including `:`, `,`, `;`, `(`, `)`, `[`, `]`, `{`, `}`)
	if (name === '<delimiter-token>') {
		switch (value) {
			case ':':
				return 'colon-token';
			case ',':
				return 'comma-token';
			case ';':
				return 'semicolon-token';
			case '(':
				return '(-token';
			case ')':
				return ')-token';
			case '[':
				return '[-token';
			case ']':
				return ']-token';
			case '{':
				return '{-token';
			case '}':
				return '}-token';
			default:
				if (value.trim() === '') {
					return 'whitespace-token';
				}
				
				return 'delim-token';
		}
	}

	return nameMapping[name] ?? name
}
