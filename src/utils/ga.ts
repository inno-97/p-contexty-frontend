declare global {
	interface Window {
		gtag: (param1: string, param2: string, param3: object) => void;
	}
}

export const pageview = (url: string) => {
	const stream_id = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS || '';

	window.gtag('config', stream_id, {
		page_path: url,
	});
};
