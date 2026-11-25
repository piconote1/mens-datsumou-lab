export const INDEXNOW_KEY = "9b4e7c12d5a843f09c1e6a28d3b75f4a";
export const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";

/** Submit one or more canonical URLs on this host to IndexNow (Bing / Copilot / Yandex / Naver). */
export async function submitToIndexNow(origin: string, urls: string[]): Promise<Response> {
	const host = new URL(origin).hostname;
	const cleanUrls = urls.filter((u) => {
		try {
			return new URL(u).hostname === host;
		} catch {
			return false;
		}
	});
	if (cleanUrls.length === 0) {
		throw new Error("No valid URLs matching host for IndexNow submission");
	}
	return fetch(INDEXNOW_ENDPOINT, {
		method: "POST",
		headers: { "Content-Type": "application/json; charset=utf-8" },
		body: JSON.stringify({
			host,
			key: INDEXNOW_KEY,
			keyLocation: `${origin}/${INDEXNOW_KEY}.txt`,
			urlList: cleanUrls.slice(0, 10000),
		}),
	});
}
