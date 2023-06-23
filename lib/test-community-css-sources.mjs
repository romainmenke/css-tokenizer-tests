import assert from 'assert';
import fs from 'fs/promises';
import path from 'path';
import { soft } from './soft-assertion.mjs';
import { tokenize } from './tokenize.mjs';
import { tokenizers } from './tokenizer-mapping.mjs';

const CHECKS_PER_TOKEN = 2;

export async function testCommunityCSSSources(tests) {
	const results = {
		tests: {},
		tokenizers: {}
	};

	for (const tokenizerName of tokenizers) {
		let tokenizerPasses = 0;
		let tokenizerChecks = 0;

		const start = performance.now();

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

				const source = (await fs.readFile(path.join('tests-community', testPath, 'source.css'))).toString();
				const expect = JSON.parse(await fs.readFile(path.join('tests-community', testPath, 'tokens.json')));

				const result = tokenize(tokenizerName, source, { includeComments: false })
				
				// if (tokenizerName === '@csstools/css-tokenizer') {
				// 	await fs.writeFile(path.join('tests-community', testPath, 'tokens.json'), JSON.stringify(result.map((x) => {
				// 		delete x.startIndex;
				// 		delete x.endIndex;
				// 		delete x.structured;

				// 		return x;
				// 	}), null, '\t'))
				// }

				for (let i = 0; i < Math.max(expect.length, result.length); i++) {
					const expectToken = expect[i];
					const actualToken = result[i];

					tokenizerChecks += CHECKS_PER_TOKEN;
					results.tests[testDirectory.name].tokenizers[tokenizerName].checks += CHECKS_PER_TOKEN;
					results.tests[testDirectory.name].tests[testPath].tokenizers[tokenizerName].checks += CHECKS_PER_TOKEN;

					if (!!actualToken && !!expectToken) {
						const typeMatches = soft(() => { assert.strictEqual(actualToken.type, expectToken.type) });
						const rawMatches = soft(() => { assert.strictEqual(actualToken.raw, expectToken.raw) });

						let pass = 0;
						pass += typeMatches ? 1 : 0;
						pass += rawMatches ? 1 : 0;

						results.tests[testDirectory.name].tests[testPath].tokenizers[tokenizerName].pass += pass;
						results.tests[testDirectory.name].tokenizers[tokenizerName].pass += pass;
						tokenizerPasses += pass;
					}
				}
			}
		}

		const end = performance.now();
		console.log(tokenizerName, end - start);

		results.tokenizers[tokenizerName] = {
			checks: tokenizerChecks,
			pass: tokenizerPasses,
		}
	}

	return results
}
