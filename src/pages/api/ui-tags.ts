import type { NextApiRequest, NextApiResponse } from 'next';
import type { IUITagComponents } from 'src/types/components';
import type { TUITag } from 'src/types/ui-data';

import sampleData from 'TestSample/ui_tags.json';

export const UITags = (req: NextApiRequest, res: NextApiResponse) => {
	const { method } = req;
	const tags = <IUITagComponents>{
		categorys: [],
		services: [],
		events: [],
	};

	try {
		for (let i = 0; i < sampleData.length; i++) {
			const data: TUITag = sampleData[i];

			if (data.type === 'category') {
				tags.categorys.push({
					...data,
					label: data.name,
					value: data.id,
				});
			} else if (data.type === 'service') {
				tags.services.push({
					...data,
					label: data.name,
					value: data.id,
				});
			} else if (data.type === 'event') {
				tags.events.push({
					...data,
					label: data.name,
					value: data.id,
				});
			}
		}

		if (method === 'GET') {
			res.status(200).json(tags);
		}
	} catch (e) {
		console.log(e);
	}
};

export default UITags;
