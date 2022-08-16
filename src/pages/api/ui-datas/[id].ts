import type { NextApiRequest, NextApiResponse } from 'next';

import sampleData from 'TestSample/ui_datas.json';

export const UIData = (req: NextApiRequest, res: NextApiResponse) => {
	const {
		method,
		query: { id },
	} = req;

	if (method === 'GET') {
		if (typeof id === 'string') {
			res.status(200).json(sampleData[parseInt(id)]);
		}
	}
};

export default UIData;
