import { ThemeOptions } from '@mui/material';

export const neutralColor = {
	100: '#F3F4F6',
	200: '#E5E7EB',
	300: '#D1D5DB',
	400: '#9CA3AF',
	500: '#6B7280',
	600: '#4B5563',
	700: '#374151',
	800: '#212529',
	900: '#111827',
};

export const textColor = {
	100: '#DEE2E6',
	200: '#ADB5BD',
	300: '#868E96',
	400: '#212529',
};

// const grey = {
// 	50: '#fafafa',
// 	100: '#f5f5f5',
// 	200: '#eeeeee',
// 	300: '#e0e0e0',
// 	400: '#bdbdbd',
// 	500: '#9e9e9e',
// 	600: '#757575',
// 	700: '#616161',
// 	800: '#424242',
// 	900: '#212121',
// };
export const baseTheme: ThemeOptions = {
	typography: {
		fontFamily: `Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, "Helvetica Neue", "Segoe UI", "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-serif;`,
	},
	components: {
		MuiCssBaseline: {
			styleOverrides: {
				html: {
					minHeight: '100%',
				},
				body: {
					minHeight: '100%',
				},
				pre: {
					margin: 0,
				},
				p: {
					margin: 0,
				},
				ul: {
					margin: 0,
					padding: 0,
				},
			},
		},
		MuiOutlinedInput: {
			styleOverrides: {
				root: {
					borderRadius: '8px',
				},
			},
		},
		MuiDialog: {
			styleOverrides: {
				root: {
					'& .MuiDialog-paper': {
						borderRadius: '16px',
						padding: '40px',
					},
				},
			},
		},
		MuiCircularProgress: {
			styleOverrides: {
				circle: {
					strokeLinecap: 'round',
				},
			},
		},
	},
};
