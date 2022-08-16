import type { Dispatch, SetStateAction } from 'react';

export interface IThemeConfig {
	themeMode?: string;
}

export interface IThemeContext extends IThemeConfig {
	setThemeMode?: Dispatch<SetStateAction<string>>;
}
