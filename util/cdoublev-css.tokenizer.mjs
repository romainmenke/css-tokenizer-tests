// import tokenize from '../../cdoublev/css/lib/parse/tokenize.js';
// import Stream from '../../cdoublev/css/lib/parse/stream.js';
import tokenize from '../node_modules/@cdoublev/css/lib/parse/tokenize.js';
import Stream from '../node_modules/@cdoublev/css/lib/parse/stream.js';

export function tokenizer(str) {
	return tokenize(new Stream(str));
}
