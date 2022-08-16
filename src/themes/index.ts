import type { Theme } from '@mui/material';
import type { IThemeConfig } from 'src/types/theme';

import { createTheme as createMuiTheme } from '@mui/material/styles';
import { baseTheme } from 'src/themes/baseTheme';

import lightTheme from 'src/themes/lightTheme';
import darkTheme from 'src/themes/darkTheme';

export const createTheme = (config: IThemeConfig): Theme => {
	const theme = createMuiTheme(baseTheme, config.themeMode === 'dark' ? darkTheme : lightTheme);

	return theme;
};
