/* Type */
export type TUITag = {
	id: number;
	type: string;
	name: string;
	icon?: string;
};

export type TUITgas = {
	category?: TUITag;
	service?: TUITag;
	events?: TUITag[];
};

export type TUIData = {
	id?: number;
	copyCount?: number;
	timestamp?: number;
	tags?: TUITgas;
	image?: string;
	imageSrc?: string;
	File?: File;
};

/* Interface */
export interface IUITextData extends TUIData {
	text?: string;
	copied?: boolean;
}

export interface IUIDatas {
	datas: IUITextData[];
}
