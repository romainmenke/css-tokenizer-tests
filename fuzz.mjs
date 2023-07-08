import { testFuzz } from './lib/test-fuzz.mjs';

for (let i = 0; i < 1000; i++) {
	testFuzz();
}
