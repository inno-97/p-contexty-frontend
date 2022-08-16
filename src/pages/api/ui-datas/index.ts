import type { NextApiRequest, NextApiResponse } from 'next';

import sampleData from 'TestSample/ui_datas.json';

export const UIDatas = (req: NextApiRequest, res: NextApiResponse) => {
	const { method } = req;

	if (method === 'GET') {
		res.status(200).json(sampleData);
	}
};

export default UIDatas;
