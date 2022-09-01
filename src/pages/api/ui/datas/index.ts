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

	if (typeof p === 'string') {
		page = parseInt(p) - 1;
	}

	const totalPage = Math.ceil(resultData.length / limit);
	const datas = resultData.splice(page * limit, limit);

	if (method === 'GET') {
		res.status(200).json({
			totalPage: totalPage,
			datas: datas,
		});
	}
};

export default UIDatas;
