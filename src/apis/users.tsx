export async function getContributors() {
	const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profiles`);
	if (!res.ok) {
		throw new Error(`Failed to Fetch, getContributors status(${res.status})`);
	}

	return res.json();
}

const UsersAPI = {
	getContributors,
};

export default UsersAPI;
