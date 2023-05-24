export async function getContributors() {
	const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profiles`);
	if (!res.ok) {
		throw new Error(`Failed to Fetch, getContributors status(${res.status})`);
	}

	return res.json();
}

export function authUser(uid: string, password: string) {
	return fetch(`${process.env.NEXT_PUBLIC_API_URL}/sign-in`, {
		method: 'POST',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			uid,
			password,
		}),
	});
}

const UsersAPI = {
	getContributors,
	authUser,
};

export default UsersAPI;
