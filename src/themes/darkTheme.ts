import { ThemeOptions } from '@mui/material';
import { red } from '@mui/material/colors';

import { neutralColor, textColor } from 'src/themes/baseTheme';

const background = {
	default: '#0B0F19',
	paper: neutralColor[900],
};

const text = {
	primary: textColor[100],
	secondary: textColor[200],
	disabled: 'rgba(55, 65, 81, 0.48)',
};

// Dark Mode 임시 방편
const grey = {
	100: textColor[400],
	200: textColor[300],
	300: textColor[200],
	400: textColor[100],
};

export const darkTheme: ThemeOptions = {
	palette: {
		mode: 'dark',
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
					borderColor: 'rgb(255 255 255 / 0.3)',
				},
			},
		},
	},
};

export default darkTheme;
