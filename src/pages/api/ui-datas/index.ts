import type { NextApiRequest, NextApiResponse } from 'next';

import sampleData from 'TestSample/ui_datas.json';

const limit = 15;

export const UIDatas = (req: NextApiRequest, res: NextApiResponse) => {
	const { method } = req;
	const query = req.query;
	const { p = null, q = null } = query;
	let page = 0;

	let resultData = [...sampleData];

	if (typeof q === 'string') {
		resultData = resultData.filter((item) => item.text.includes(q));
	}

	if (typeof p === 'number') {
		page = parseInt(p) - 1;
	}

	const test = resultData.splice(page * limit, limit);

	if (method === 'GET') {
		res.status(200).json(test);
	}
};

export default UIDatas;
