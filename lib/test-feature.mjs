import assert from 'assert';
import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';
import { soft } from './soft-assertion.mjs';
import { tokenize } from './tokenize.mjs';
import { tokenizers } from './tokenizer-mapping.mjs';

const debugMode = !!process.env.DEBUG;

export async function testFeatures(tests, minimal = false) {
	const CHECKS_PER_TOKEN = minimal ? 1 : 5;

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
			};

			for (const testPath of testDirectory.tests) {
				results.tests[testDirectory.name].tests[testPath] = results.tests[testDirectory.name].tests[testPath] ?? {
					tokenizers: {}
				};

				results.tests[testDirectory.name].tests[testPath].tokenizers[tokenizerName] = {
					checks: 0,
					pass: 0,
				};

				const source = (await fs.readFile(path.join('tests', testPath, 'source.css'))).toString();
				const expect = JSON.parse(await fs.readFile(path.join('tests', testPath, 'tokens.json')));

				const result = tokenize(tokenizerName, source, { includeComments: true });

				const expectB = [];
				const expectLookup = new Map();
				const resultB = [];
				const resultLookup = new Map();
				for (let i = 0; i < Math.max(expect.length, result.length); i++) {
					const expectToken = expect[i];
					const actualToken = result[i];

					if (expectToken) {
						const key = JSON.stringify(expectToken);
						expectB.push(key);
						expectLookup.set(key, expectToken);
					} else {
						const key = crypto.randomUUID();
						expectB.push(key);
						expectLookup.set(key, expectToken);
					}

					if (actualToken) {
						const key = JSON.stringify(actualToken);
						resultB.push(key);
						resultLookup.set(key, actualToken);
					} else {
						const key = crypto.randomUUID();
						resultB.push(key);
						resultLookup.set(key, actualToken);
					}
				}

				let l = expectB.length;
				let i = 0;
				let j = 0;

				CHECK_LOOP:
				while (i < l || j < l) {
					const expectKey = expectB[i];
					const actualKey = resultB[j];
					const expectToken = expectLookup.get(expectKey);
					const actualToken = resultLookup.get(actualKey);

					tokenizerChecks += CHECKS_PER_TOKEN;
					results.tests[testDirectory.name].tokenizers[tokenizerName].checks += CHECKS_PER_TOKEN;
					results.tests[testDirectory.name].tests[testPath].tokenizers[tokenizerName].checks += CHECKS_PER_TOKEN;

					if (!!actualToken && !!expectToken) {
						const typeMatches = actualToken.type === expectToken.type;
						const rawMatches = actualToken.raw === expectToken.raw;
						const startIndexMatches = actualToken.startIndex === expectToken.startIndex;
						const endIndexMatches = actualToken.endIndex === expectToken.endIndex;
						const structuredMatches = soft(() => { assert.deepStrictEqual(actualToken.structured, expectToken.structured) });

						let pass = 0;
						pass += typeMatches ? 1 : 0;
						if (!minimal) {
							pass += rawMatches ? 1 : 0;
							pass += startIndexMatches ? 1 : 0;
							pass += endIndexMatches ? 1 : 0;
							pass += structuredMatches ? 1 : 0;
						}

						if (debugMode && pass !== CHECKS_PER_TOKEN) {
							debugInfo.push({
								tokenizer: tokenizerName,
								'test path': testPath,
								'token index': i,
								'type': typeMatches,
								'raw': rawMatches,
								'raw diff': rawMatches ? null : rawDiff(actualToken.raw, expectToken.raw),
								'start index': startIndexMatches,
								'end index': endIndexMatches,
								'structured': structuredMatches,
							});
						}

						results.tests[testDirectory.name].tests[testPath].tokenizers[tokenizerName].pass += pass;
						results.tests[testDirectory.name].tokenizers[tokenizerName].pass += pass;
						tokenizerPasses += pass;

						{
							// Scan ahead to see if a future token matches a current token.
							// If so, only advance one of the cursors.
							// This handles cases where tokenizers temporarily diverge but eventually start seeing the same tokens again.
							// The alternative is to count every token after a single divergence as a failure.
							if (CHECKS_PER_TOKEN !== pass) {
								for (let ii = i + 1; ii < l; ii++) {
									const laterExpectKey = expectB[ii];

									if (laterExpectKey === actualKey) {
										i++;
										continue CHECK_LOOP;
									}
								}

								for (let jj = j + 1; jj < l; jj++) {
									const laterActualKey = resultB[jj];

									if (laterActualKey === expectKey) {
										j++;
										continue CHECK_LOOP;
									}
								}
							}
						}
					}

					i++;
					j++;
				}
			}
		}

		results.tokenizers[tokenizerName] = {
			checks: tokenizerChecks,
			pass: tokenizerPasses,
		};
	}

	if (debugInfo.length > 0) {
		console.table(debugInfo);
	}

	return results;
}

function rawDiff(a, b) {
	try {
		assert.equal(a, b);
	} catch (err) {
		return err.message;
	}
}
