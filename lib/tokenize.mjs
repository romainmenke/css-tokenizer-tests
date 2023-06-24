import { csstoolsCSSTokenizerToUniversal } from '../util/csstools-css-tokenizer-to-universal.mjs';
import { csstoolsTokenizerToUniversal } from '../util/csstools-tokenizer-to-universal.mjs';
import { csstreeToUniversal } from '../util/css-tree-to-universal.mjs';
import { tokenize as tokenizer2 } from '@csstools/tokenizer'
import { tokenize as tokenizer3 } from 'css-tree/tokenizer'
import { tokenize as tokenizer4 } from 'parse-css/parse-css.js'
import { tokenizer as tokenizer1, TokenType } from '@csstools/css-tokenizer'
import { lex as tokenizer5, value as tokenizer5_Value } from 'csslex'
import { parseCssToUniversal } from '../util/parse-css-to-universal.mjs';
import { cssLexToUniversal } from '../util/csslex-to-universal.mjs';

export function tokenize(tokenizerName, source, config) {
	if (tokenizerName === '@csstools/css-tokenizer') {
		const result = [];

		const t = tokenizer1({
			css: source,
		});

		while (true) {
			const token = t.nextToken();
			if (token[0] === TokenType.EOF) {
				break;
			}

			const uToken = csstoolsCSSTokenizerToUniversal(token);
			if (!config.includeComments && uToken.type === 'comment') {
				continue;
			}

			result.push(uToken);
		}

		return result;
	}

	if (tokenizerName === '@csstools/tokenizer') {
		const result = [];

		for (const token of tokenizer2(source)) {
			const uToken = csstoolsTokenizerToUniversal(token, source);
			if (!config.includeComments && uToken.type === 'comment') {
				continue;
			}

			result.push(uToken);
		}

		return result;
	}

	if (tokenizerName === 'css-tree') {
		const result = [];

		tokenizer3(source, (token, start, end) => {
			const uToken = csstreeToUniversal([token, start, end], source);
			if (!config.includeComments && uToken.type === 'comment') {
				return;
			}

			result.push(uToken);
		});

		return result;
	}

	if (tokenizerName === 'parse-css') {
		const result = [];

		try {
			tokenizer4(source).forEach((token) => {
				const uToken = parseCssToUniversal(token);
				if (!config.includeComments && uToken.type === 'comment') {
					return;
				}

				result.push(uToken);
			});
		} catch (err) {
			console.log('parce-css', err);
		}

		return result;
	}

	if (tokenizerName === 'csslex') {
		const result = [];

		for (const token of tokenizer5(source)) {
			const uToken = cssLexToUniversal(token, source);
			if (!config.includeComments && uToken.type === 'comment') {
				continue;
			}

			result.push(uToken);
		}

		return result;
	}

	return [];
}
