import assert from 'assert';
import fs from 'fs/promises';
import { soft } from './soft-assertion.mjs';
import { tokenize } from './tokenize.mjs';
import crypto from 'crypto';

async function store(tokens) {
	const resultStr = tokens.map((x) => x.raw).join('');
	const firstIndex = tokens[0].startIndex;

	tokens.forEach((x) => {
		x.startIndex = x.startIndex - firstIndex;
		x.endIndex = x.endIndex - firstIndex;
	});

	const id = crypto.randomUUID();
	await fs.mkdir(`./tests/fuzz/${id}`)
	await fs.writeFile(`./tests/fuzz/${id}/source.css`, resultStr)
	await fs.writeFile(`./tests/fuzz/${id}/tokens.json`, JSON.stringify(tokens, null, '\t'))
}

export async function testFuzz() {
	const source = createRandomSource();

	const result = tokenize('@csstools/css-tokenizer', source, { includeComments: true })
	const expect = tokenize('css-tree', source, { includeComments: true })

	for (let i = 0; i < result.length; i++) {
		const expectToken = expect[i];
		const actualToken = result[i];

		if (!expectToken || !actualToken) {
			console.log('missing token');
			console.log(result.slice(i - 2, i + 2));
			console.log(expect.slice(i - 2, i + 2));
			console.log('-------------------------------');

			await store(result.slice(i - 5, i + 5));
			break;
		}

		const typeMatches = soft(() => { assert.strictEqual(actualToken.type, expectToken.type) });
		if (!typeMatches) {
			console.log('type mismatch');
			console.log(result.slice(i - 2, i + 2));
			console.log(expect.slice(i - 2, i + 2));
			console.log('-------------------------------');

			await store(result.slice(i - 5, i + 5));
			break;
		}

		const rawMatches = soft(() => { assert.strictEqual(actualToken.raw, expectToken.raw) });
		if (!rawMatches) {
			console.log('raw mismatch');
			console.log(result.slice(i - 2, i + 2));
			console.log(expect.slice(i - 2, i + 2));
			console.log('-------------------------------');

			await store(result.slice(i - 5, i + 5));
			break;
		}
	}
}

const controlCharacters = [
	/** ' */
	String.fromCharCode(0x0027),
	/** * */
	String.fromCharCode(0x002a),
	/** \b */
	String.fromCharCode(0x008),
	/** \r */
	String.fromCharCode(0x00d),
	/** \t */
	String.fromCharCode(0x009),
	/** : */
	String.fromCharCode(0x003a),
	/** , */
	String.fromCharCode(0x002c),
	/** @ */
	String.fromCharCode(0x0040),
	/** \x7F */
	String.fromCharCode(0x007f),
	/** ! */
	String.fromCharCode(0x0021),
	/** \f */
	String.fromCharCode(0x000c),
	/** . */
	String.fromCharCode(0x002e),
	/** > */
	String.fromCharCode(0x003e),
	/** - */
	String.fromCharCode(0x002d),
	/** \x1F */
	String.fromCharCode(0x001f),
	/** E */
	String.fromCharCode(0x0045),
	/** e */
	String.fromCharCode(0x0065),
	/** { */
	String.fromCharCode(0x007b),
	/** ( */
	String.fromCharCode(0x0028),
	/** [ */
	String.fromCharCode(0x005b),
	/** < */
	String.fromCharCode(0x003c),
	/** \n */
	String.fromCharCode(0x00a),
	/** \v */
	String.fromCharCode(0x00b),
	/** _ */
	String.fromCharCode(0x005f),
	/** \x00 */
	String.fromCharCode(0x000),
	/** # */
	String.fromCharCode(0x0023),
	/** % */
	String.fromCharCode(0x0025),
	/** + */
	String.fromCharCode(0x002b),
	/** " */
	String.fromCharCode(0x0022),
	/** � */
	String.fromCharCode(0xFFFD),
	/** \ */
	String.fromCharCode(0x005c),
	/** } */
	String.fromCharCode(0x007d),
	/** ) */
	String.fromCharCode(0x0029),
	/** ] */
	String.fromCharCode(0x005d),
	/** ; */
	String.fromCharCode(0x003b),
	/** \u0E */
	String.fromCharCode(0x00e),
	/** / */
	String.fromCharCode(0x002f),
	/** \u20 */
	String.fromCharCode(0x0020),
];

const controlCharactersLength = controlCharacters.length;

const commonCharacters = [
	'a',
	'b',
	'c',
	'd',
	'e',
	'f',
	'g',
	'h',
	'i',
	'j',
	'k',
	'l',
	'm',
	'n',
	'o',
	'p',
	'q',
	'r',
	's',
	't',
	'u',
	'v',
	'w',
	'x',
	'y',
	'z',
	'0',
	'1',
	'2',
	'3',
	'4',
	'5',
	'6',
	'7',
	'8',
	'9',
];

const commonCharactersLength = commonCharacters.length;

function createRandomSource() {
	let result = '';
	const size = 100 + randomIndex(1000)
	for (let i = 0; i < size; i++) {
		result += randomNext();
	}

	return result;
}

function randomNext() {
	if (randomIndex(100) < 80) { // 80% common chars
		return randomCase(randomCommonChar());
	}

	if (randomIndex(100) < 50) { // 10% control chars
		return randomControlChar();
	}

	if (randomIndex(100) < 50) { // 5% control chars
		return randomTokenSplit();
	}

	if (randomIndex(100) < 10) { 
		return randomParenthesisBlock();
	}

	if (randomIndex(100) < 20) {
		return randomCurlyBlock();
	}

	if (randomIndex(100) < 30) {
		return randomSquareBlock();
	}

	if (randomIndex(100) < 40) {
		return randomString();
	}

	if (randomIndex(100) < 50) {
		return randomEscapeSequence();
	}

	return String.fromCharCode(randomIndex(1114112 + 1000)) // completely random chars
}

function randomParenthesisBlock() {
	let result = '';
	const size = 2 + randomIndex(10)
	for (let i = 0; i < size; i++) {
		result += randomNext();
	}

	return '('+ result + ')';
}

function randomEscapeSequence() {
	if (randomBoolean()) {
		return '\\' + randomIndex(1114112 + 1000).toString(16) + ' ';
	}

	return '\\' + randomIndex(1114112 + 1000).toString(16)
}

function randomCurlyBlock() {
	let result = '';
	const size = 2 + randomIndex(10)
	for (let i = 0; i < size; i++) {
		result += randomNext();
	}

	return '{' + result + '}';
}

function randomSquareBlock() {
	let result = '';
	const size = 2 + randomIndex(10)
	for (let i = 0; i < size; i++) {
		result += randomNext();
	}

	return '(' + result + ')';
}

function randomString() {
	let result = '';
	const size = 2 + randomIndex(10)
	for (let i = 0; i < size; i++) {
		result += randomNext();
	}

	return '"' + result + '"';
}

function randomCase(str) {
	if (randomBoolean()) {
		return str.toLowerCase();
	}

	return str.toUpperCase();
}

function randomTokenSplit() {
	if (randomBoolean()) {
		// No split
		return '';
	}

	if (randomBoolean()) {
		// Whitespace split
		return ' ';
	}

	// Comment split
	return '/* a comment */';
}

function randomControlChar() {
	return controlCharacters[randomIndex(controlCharactersLength)]
}

function randomCommonChar() {
	return commonCharacters[randomIndex(commonCharactersLength)]
}

function randomBoolean() {
	return ((Math.floor(Math.random() * (Number.MAX_SAFE_INTEGER / 2)) % 2) === 0)
}

function randomIndex(max) {
	return Math.floor(Math.random() * max);
}
