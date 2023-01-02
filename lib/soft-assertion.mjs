export function soft(assertion) {
	try {
		assertion();
		return true;
	} catch (_) {
		return false;
	}
}
