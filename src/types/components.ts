import type {
	ReactElement,
	PropsWithChildren,
	SyntheticEvent,
	Dispatch,
	SetStateAction,
} from 'react';
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

export type TDataTableRow = {
	[key: string]: string | number | boolean | ReactElement;
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
	color?: string;
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

export interface IDialog extends PropsWithChildren {
	open: boolean;
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

export interface IUIDialogViewer {
	write?: boolean;
	open: boolean;
	onClose: () => void;
	tags?: IUITagComponents;
	data?: IUITextData;
	setData?: Dispatch<SetStateAction<IUITextData>>;
	onUITextCopy?: (id: number, tooltip: (message: string) => void) => Promise<void>;
	BottomComponent?: ReactElement;
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

export interface ISelectedTags {
	tags: IUITagComponents;
	size?: 'small' | 'medium';
	clearEvent: (idx: 'all' | IUITagsItem) => void;
}

export interface IUITagComponents {
	[key: string]: IUITagsItem[];
	categorys: IUITagsItem[];
	services: IUITagsItem[];
	events: IUITagsItem[];
}

export interface ITagChip {
	size?: 'small' | 'medium';
	type: 'category' | 'service' | 'events';
	label?: string;
	value?: number;
	margin?: string;
	onDelete?: (event: SyntheticEvent) => void;
}

export interface ITabContents extends PropsWithChildren {
	value: number;
	index: number;
}

export interface IDataTable {
	sx?: SxProps;
	onRowsPerPage?: boolean;
	rowsPerPageList?: number[];
	rowsPerPage?: number;
	onTotalCount?: boolean;
	onTopPagination?: boolean;
	onBottomPagination?: boolean;
	page?: number;
	changePage?: (page: number) => void;
	totalCount?: number;
	selecting?: boolean;
	headers: {
		key: string | number;
		name?: string;
		align?: 'right' | 'left' | 'center';
		width?: string;
	}[];
	rows: TDataTableRow[];
	rowOptions?: {
		column?: {
			[key: string | number]: {
				onClick?: (event: SyntheticEvent, row: TDataTableRow) => void;
			};
		};
	};
}
