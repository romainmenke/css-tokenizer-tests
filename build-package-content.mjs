import path from 'path';
import fs from 'fs/promises';
import { resultsAsHTML } from "./lib/results-as-html.mjs";

import { testFeatures } from "./lib/test-feature.mjs";

import { traverseDir } from "./lib/traverse-dir.mjs";

{
	const packageContents = {};
	const tests = new Set();
	const testFiles = new Set(await traverseDir('./tests'));

	for (const testFile of testFiles) {
		const testFileParsed = path.parse(testFile);
		const testDirParsed = path.parse(testFileParsed.dir);
		const testGroupName = path.parse(testDirParsed.dir).base;
		const test = path.join(testGroupName, testDirParsed.base);

		{
			if (tests.has(test)) {
				continue;
			}

			tests.add(test);
		}

		if (
			testFiles.has(path.join(testFileParsed.dir, 'source.css')) &&
			testFiles.has(path.join(testFileParsed.dir, 'tokens.json'))
		) {
			packageContents[testFileParsed.dir] = {
				'css': (await fs.readFile(path.join(testFileParsed.dir, 'source.css'))).toString(),
				'tokens': JSON.parse((await fs.readFile(path.join(testFileParsed.dir, 'tokens.json'))).toString())
			}
		}
	}

	await fs.writeFile('./index.mjs', `export const testCorpus = ${JSON.stringify(packageContents)}`)
}
