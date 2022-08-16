import type { FC } from 'react';

import React from 'react';
import IconButton from '@mui/material/IconButton';
import { Brightness4, Brightness7 } from '@mui/icons-material';

import { useThemeConfigContext } from 'src/contexts/ThemeConfigContext';

export const ToggleThemeMode: FC = () => {
	const { themeMode, setThemeMode } = useThemeConfigContext();

	const setColorMode = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		const mode = e.currentTarget.value === 'dark' ? 'light' : 'dark';

		if (setThemeMode !== undefined) {
			setThemeMode(mode);
		}
	};

	const color = themeMode === 'dark' ? 'inherit' : 'default';
	return (
		<IconButton sx={{ ml: 1 }} onClick={setColorMode} color={color} value={themeMode}>
			{themeMode === 'dark' ? <Brightness7 /> : <Brightness4 />}
		</IconButton>
	);
};

export default ToggleThemeMode;
