export function debounce(fn, wait = 3000, options = {}) {
	const { leading = false, trailing = true } = options
	let timer = null
	let lastArgs
	let lastThis
	let leadingCalled = false

	function invoke() {
		timer = null
		if (trailing && lastArgs) {
			fn.apply(lastThis, lastArgs)
		}
		lastArgs = null
		lastThis = null
		leadingCalled = false
	}

	function debounced(...args) {
		lastArgs = args
		lastThis = this

		if (timer) clearTimeout(timer)

		if (leading && !leadingCalled) {
			leadingCalled = true
			fn.apply(lastThis, lastArgs)
			lastArgs = null
			lastThis = null
		}

		timer = setTimeout(invoke, wait)
	}

	debounced.cancel = () => {
		if (timer) clearTimeout(timer)
		timer = null
		lastArgs = null
		lastThis = null
		leadingCalled = false
	}

	return debounced
}

