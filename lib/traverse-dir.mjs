import fs from 'fs/promises';
import path from 'path';

export async function traverseDir(dir) {
	const out = [];

	const files = await fs.readdir(dir);
	for (let i = 0; i < files.length; i++) {
		const file = files[i];
		let fullPath = path.join(dir, file);
		if ((await fs.lstat(fullPath)).isDirectory()) {
			out.push(...(await traverseDir(fullPath)));
		} else {
			out.push(fullPath);
		}
	}

	return out;
}
