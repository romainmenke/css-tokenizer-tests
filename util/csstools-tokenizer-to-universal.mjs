export function csstoolsTokenizerToUniversal(token, source) {
	return {
		type: tokenToUniversal(token),
		raw: token.lead + token.data + token.tail,
		startIndex: token.tick,
		endIndex: token.tick + token.lead.length + token.data.length + token.tail.length,
		structured: null
	}
}

function tokenToUniversal(token) {
	switch (token.type) {
		case 1: // Symbol
			switch (token.data) {
				case '(':
					return '(-token';
				case ')':
					return ')-token';
				case '{':
					return '{-token';
				case '}':
					return '}-token';
				case '[':
					return '[-token';
				case ']':
					return ']-token';
				case ';':
					return 'semicolon-token';
				case ':':
					return 'colon-token';
				case ',':
					return 'comma-token';
			
				default:
					return 'delim-token';
			}
		case 2: // Comment
			return 'comment';
		case 3: // Space
			return 'whitespace-token';
		case 4: // Word
			return 'ident-token';
		case 5: // Function
			return 'function-token';
		case 6: // Atword
			return 'at-keyword-token';
		case 7: // Hash
			return 'hash-token';
		case 8: // String
			return 'string-token';
		case 9: // Number
			return 'number-token';
	}
}
