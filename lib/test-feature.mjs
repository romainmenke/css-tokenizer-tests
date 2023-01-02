import assert from 'assert';
import fs from 'fs/promises';
import path from 'path';
import { soft } from './soft-assertion.mjs';
import { tokenize } from './tokenize.mjs';
import { tokenizers } from './tokenizer-mapping.mjs';

const CHECKS_PER_TOKEN = 5;
const debugMode = !!process.env.DEBUG;

export async function testFeatures(tests) {
	const results = {
		tests: {},
		tokenizers: {}
	};

	const debugInfo = [];

	for (const tokenizerName of tokenizers) {
		let tokenizerPasses = 0;
		let tokenizerChecks = 0;

		for (const testDirectory of tests) {
			results.tests[testDirectory.name] = results.tests[testDirectory.name] ?? {
				tests: {},
				tokenizers: {}
			};

			results.tests[testDirectory.name].tokenizers[tokenizerName] = results.tests[testDirectory.name].tokenizers[tokenizerName] ?? {
				checks: 0,
				pass: 0,
			}

			for (const testPath of testDirectory.tests) {
				results.tests[testDirectory.name].tests[testPath] = results.tests[testDirectory.name].tests[testPath] ?? {
					tokenizers: {}
				};
				results.tests[testDirectory.name].tests[testPath].tokenizers[tokenizerName] = {
					checks: 0,
					pass: 0,
				}

				const source = (await fs.readFile(path.join('tests', testPath, 'source.css'))).toString();
				const expect = JSON.parse(await fs.readFile(path.join('tests', testPath, 'tokens.json')));

				const result = tokenize(tokenizerName, source, { includeComments: true })

				for (let i = 0; i < Math.max(expect.length, result.length); i++) {
					const expectToken = expect[i];
					const actualToken = result[i];

					tokenizerChecks += CHECKS_PER_TOKEN;
					results.tests[testDirectory.name].tokenizers[tokenizerName].checks += CHECKS_PER_TOKEN;
					results.tests[testDirectory.name].tests[testPath].tokenizers[tokenizerName].checks += CHECKS_PER_TOKEN;

					if (!!actualToken, !!expectToken) {
						const typeMatches = soft(() => { assert.strictEqual(actualToken.type, expectToken.type) });
						const rawMatches = soft(() => { assert.strictEqual(actualToken.raw, expectToken.raw) });
						const startIndexMatches = soft(() => { assert.strictEqual(actualToken.startIndex, expectToken.startIndex) });
						const endIndexMatches = soft(() => { assert.strictEqual(actualToken.endIndex, expectToken.endIndex) });
						const structuredMatches = soft(() => { assert.deepStrictEqual(actualToken.structured, expectToken.structured) });

						let pass = 0;
						pass += typeMatches ? 1 : 0;
						pass += rawMatches ? 1 : 0;
						pass += startIndexMatches ? 1 : 0;
						pass += endIndexMatches ? 1 : 0;
						pass += structuredMatches ? 1 : 0;

						if (debugMode && pass !== CHECKS_PER_TOKEN) {
							debugInfo.push({
								tokenizer: tokenizerName,
								'test path': testPath,
								'token index': i,
								'type': typeMatches,
								'raw': rawMatches,
								'start index': startIndexMatches,
								'end index': endIndexMatches,
								'structured': structuredMatches
							});
						}

						results.tests[testDirectory.name].tests[testPath].tokenizers[tokenizerName].pass += pass;
						results.tests[testDirectory.name].tokenizers[tokenizerName].pass += pass;
						tokenizerPasses += pass;
					}
				}
			}
		}

		results.tokenizers[tokenizerName] = {
			checks: tokenizerChecks,
			pass: tokenizerPasses,
		}
	}

	if (debugInfo.length > 0) {
		console.table(debugInfo);
	}

	return results
}
