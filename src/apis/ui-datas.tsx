import type { TUITgas, IUITextData } from 'src/types/ui-data';

export function getQueryString(page: number | null, word: string | null, tags: string | null) {
	const query = [];

	if (typeof page === 'number') {
		query.push(`p=${page}`);
	}

	if (typeof word === 'string' && word !== '') {
		query.push(`q=${word}`);
	}

	if (typeof tags === 'string' && tags !== '') {
		query.push(`t=${tags.slice(0, -1)}`);
	}

	return query.join('&');
}

export async function getUIDatas(query = '') {
	const res = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}/ui/datas${query === null ? '' : '?' + query}`
	);
	if (!res.ok) {
		throw new Error(`Failed to Fetch, getUIDatas status(${res.status})`);
	}

	return res.json();
}

export async function getUIdata(id: number | null = null) {
	if (id === null) {
		throw 'getUIdata ID is Null';
	}

	const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ui/datas/${id}`);
	if (!res.ok) {
		throw new Error(`Failed to Fetch, getUIData status(${res.status})`);
	}
	return res.json();
}

export async function createUIData(image?: string, text?: string, tags?: TUITgas) {
	const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ui/datas`, {
		method: 'POST',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ datas: [{ image, text, tags }] }),
	});

	if (!res.ok) {
		throw new Error(`Failed to Fetch, createUIData status(${res.status})`);
	}

	return res.json();
}

export async function updateUIData(data: IUITextData) {
	const dataForm = new FormData();

	if (data?.File !== undefined) {
		dataForm.append('file', data.File);
		data.File = undefined;
	}

	dataForm.append('data', JSON.stringify(data));

	const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ui/datas/${data.id}`, {
		method: 'PUT',
		credentials: 'include',
		body: dataForm,
	});

	if (!res.ok) {
		throw new Error(`Failed to Fetch, updateUIData status(${res.status})`);
	}

	return res.json();
}

export async function deleteUIData(id: number) {
	const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ui/datas/${id}`, {
		method: 'DELETE',
		credentials: 'include',
	});

	if (!res.ok) {
		throw new Error(`Failed to Fetch, deleteUIData status(${res.status})`);
	}

	return res.json();
}

const UIDatasAPI = {
	getQueryString,
	getUIDatas,
	getUIdata,
	createUIData,
	updateUIData,
	deleteUIData,
};

export default UIDatasAPI;
