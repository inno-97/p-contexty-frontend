import type { ReactElement, PropsWithChildren, SyntheticEvent } from 'react';
import type { NextPage } from 'next';
import type { SxProps } from '@mui/system';
import type { TUITag, IUITextData } from 'src/types/ui-data';

/* Type */
export type TNextPageWithLayout = NextPage & {
	PageLayout?: (page: PropsWithChildren) => ReactElement;
};

export type TNavItem = {
	items: { name: string; link: string; icon?: ReactElement }[];
};

/* Interface */
export interface IDepthLayer extends PropsWithChildren {
	depth: number;
	sx?: SxProps;
}

export interface IContents extends PropsWithChildren {
	title?: string;
}

export interface IContentsCard extends PropsWithChildren {
	sx?: SxProps;
	onClick?: () => void;
}

export interface IWritingDefault extends PropsWithChildren {
	className?: string;
	textAlign?: 'center' | 'end' | 'justify' | 'left' | 'match-parent' | 'right' | 'start';
	lineSpacing?: number;
	size?: string;
	weight?: string;
}

export interface IWriting extends IWritingDefault {
	paragraphSpacing?: number;
	mt?: number;
	mb?: number;
}

export interface IParagraph extends IWritingDefault {
	mt?: number;
	mb?: number;
}

export interface ISentence extends IWritingDefault {}

export interface IDialog {
	open: boolean;
	children?: React.ReactNode;
	onClose: () => void;
}

export interface ISelectFilter {
	id: string;
	disabled?: boolean;
	sx?: SxProps;
	StartIcon?: ReactElement;
	label?: string;
	options: { label: string | number }[];
	inputValue?: string | number | null;
	onOptionClick?: (event: SyntheticEvent) => void;
}

export interface IUITextComponent {
	item: IUITextData;
	onCopy?: boolean;
	onTags?: boolean;
	handleCopy: (id: number, tooltip: (message: string) => void) => void;
}

export interface IUITagsItem extends TUITag {
	label: string;
	value: number;
	selected?: boolean;
}

export interface IUITagComponents {
	[key: string]: IUITagsItem[];
	categorys: IUITagsItem[];
	services: IUITagsItem[];
	events: IUITagsItem[];
}

export interface ITabContents {
	children?: React.ReactNode;
	value: number;
	index: number;
}
