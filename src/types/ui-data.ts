/* Type */
export type TUITag = {
	id: number;
	type: string;
	name: string;
	icon?: string;
};

export type TUIData = {
	id: number;
	copyCount: number;
	timestamp: number;
	tags?: {
		category: TUITag;
		service: TUITag;
		events: TUITag[];
	};
	image?: string;
};

/* Interface */
export interface IUITextData extends TUIData {
	text: string;
	copied?: boolean;
}

export interface IUIDatas {
	datas: IUITextData[];
}
