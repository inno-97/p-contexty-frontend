/* Type */
export type TLink = {
	name: string;
	link: string;
};

/* Interface */
export interface IProfile {
	name: string;
	uuid?: string;
	links: TLink[];
}

export interface IProfiles {
	datas: IProfile[];
}
