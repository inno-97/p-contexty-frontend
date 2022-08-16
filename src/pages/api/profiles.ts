import type { NextApiRequest, NextApiResponse } from 'next';

import sampleData from 'TestSample/profiles.json';

export const Profiles = (req: NextApiRequest, res: NextApiResponse) => {
	const { method } = req;

	if (method === 'GET') {
		res.status(200).json(sampleData);
	}
};

export default Profiles;
