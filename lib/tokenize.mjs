import { csstoolsCSSTokenizerToUniversal } from '../util/csstools-css-tokenizer-to-universal.mjs';
import { csstoolsTokenizerToUniversal } from '../util/csstools-tokenizer-to-universal.mjs';
import { csstreeToUniversal } from '../util/css-tree-to-universal.mjs';
import { tokenize as tokenizer2 } from '@csstools/tokenizer'
import { tokenize as tokenizer3 } from 'css-tree/tokenizer'
import { tokenizer as tokenizer1, TokenType } from '@csstools/css-tokenizer'

export function tokenize(tokenizerName, source, config) {
	if (tokenizerName === '@csstools/css-tokenizer') {
		const result = [];

		const t = tokenizer1({
			css: source,
		}, {
			commentsAreTokens: config?.includeComments,
		});

		while (true) {
			const token = t.nextToken();
			if (token[0] === TokenType.EOF) {
				break;
			}

			result.push(csstoolsCSSTokenizerToUniversal(token));
		}

		return result
	}

	if (tokenizerName === '@csstools/tokenizer') {
		const result = [];

		for (const token of tokenizer2(source)) {
			console.log(token);
			result.push(csstoolsTokenizerToUniversal(token, source));
		}

		return result
	}

	if (tokenizerName === 'css-tree') {
		const result = [];

		tokenizer3(source, (token, start, end) => {
			result.push(csstreeToUniversal([token, start, end], source));
		});

		return result
	}

	return []
}
