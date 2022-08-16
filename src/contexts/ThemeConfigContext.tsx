import type { IThemeContext } from 'src/types/theme';

import { createContext, useContext } from 'react';

export const ThemeConfigContext = createContext<IThemeContext>({});

export const useThemeConfigContext = () => {
	return useContext(ThemeConfigContext);
};

export default ThemeConfigContext;
