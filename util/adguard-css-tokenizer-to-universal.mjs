import { TokenType, decodeIdent } from '@adguard/css-tokenizer';

export function adGuardCssTokenizerToUniversal([token, start, end], source) {
	const type = typeMapping[token] ?? token;

	let structured = null;

	switch (type) {
		case 'ident-token':
			structured = {
				value: decodeIdent(source.slice(start, end)),
			};
			break;

		case 'at-keyword-token':
			structured = {
				value: decodeIdent(source.slice(start + 1, end)),
			};
			break;

		case 'hash-token':
			structured = {
				value: decodeIdent(source.slice(start + 1, end)),
				type: 'unrestricted',
			};
			break;

		case 'string-token':
			structured = {
				value: source.slice(start, end),
			};
			break;

		case 'delim-token':
			structured = {
				value: source.slice(start, end),
			};
			break;

		default:
			break;
	}

	return {
		type,
		raw: source.slice(start, end),
		startIndex: start,
		endIndex: end,
		structured,
	};
}

const typeMapping = {
	[TokenType.OpenParenthesis]: '(-token',
	[TokenType.CloseParenthesis]: ')-token',
	[TokenType.Cdc]: 'CDC-token',
	[TokenType.Cdo]: 'CDO-token',
	[TokenType.Eof]: 'EOF-token',
	[TokenType.OpenSquareBracket]: '[-token',
	[TokenType.CloseSquareBracket]: ']-token',
	[TokenType.AtKeyword]: 'at-keyword-token',
	[TokenType.BadString]: 'bad-string-token',
	[TokenType.BadUrl]: 'bad-url-token',
	[TokenType.Colon]: 'colon-token',
	[TokenType.Comma]: 'comma-token',
	[TokenType.Comment]: 'comment',
	[TokenType.Delim]: 'delim-token',
	[TokenType.Dimension]: 'dimension-token',
	[TokenType.Function]: 'function-token',
	[TokenType.Hash]: 'hash-token',
	[TokenType.Ident]: 'ident-token',
	[TokenType.Number]: 'number-token',
	[TokenType.Percentage]: 'percentage-token',
	[TokenType.Semicolon]: 'semicolon-token',
	[TokenType.String]: 'string-token',
	[TokenType.Url]: 'url-token',
	[TokenType.Whitespace]: 'whitespace-token',
	[TokenType.OpenCurlyBracket]: '{-token',
	[TokenType.CloseCurlyBracket]: '}-token',
};
