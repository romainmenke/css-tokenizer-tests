import { testFuzz } from './lib/test-fuzz.mjs';

for (let i = 0; i < 100_000; i++) {
	testFuzz();
}
