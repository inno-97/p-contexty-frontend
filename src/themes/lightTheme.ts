import { ThemeOptions } from '@mui/material';
import { red } from '@mui/material/colors';

import { textColor } from 'src/themes/baseTheme';

const background = {
	default: '#FFFFFF',
	paper: '#F9FAFC',
};

const text = {
	primary: textColor[400],
	secondary: textColor[300],
	disabled: 'rgba(55, 65, 81, 0.48)',
};

// Dark Mode 임시 방편
const grey = {
	100: textColor[100],
	200: textColor[200],
	300: textColor[300],
	400: textColor[400],
};

export const lightTheme: ThemeOptions = {
	palette: {
		mode: 'light',
		text,
		background,
		grey,
		primary: {
			main: '#556cd6',
		},
		secondary: {
			main: '#19857b',
		},
		error: {
			main: red.A400,
		},
	},
	components: {
		MuiAppBar: {
			styleOverrides: {
				root: {
					backgroundColor: background.default,
				},
			},
		},
		MuiDivider: {
			styleOverrides: {
				root: {
					borderColor: grey[100],
				},
			},
		},
		MuiDialog: {
			styleOverrides: {
				root: {
					'& .MuiDialog-paper': {
						backgroundColor: '#ffffff',
					},
				},
			},
		},
		MuiPaper: {
			styleOverrides: {
				root: {
					backgroundColor: '#F8F9FA',
				},
			},
		},
		MuiChip: {
			styleOverrides: {
				root: {
					backgroundColor: '#F1F3F5',
				},
			},
		},
	},
};

export default lightTheme;
