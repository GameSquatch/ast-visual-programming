async function apiCall() {
	return await new Promise((res, rej) => {
		const r = Math.round(Math.random() * 300);
		setTimeout(() => res(r), 1200);
	});
}

export { apiCall };