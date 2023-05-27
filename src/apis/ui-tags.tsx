export async function getUITags() {
	const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ui/tags`);
	if (!res.ok) {
		throw new Error(`Failed to Fetch, getUITags status(${res.status})`);
	}

	return res.json();
}

const UITagsAPI = {
	getUITags,
};

export default UITagsAPI;
