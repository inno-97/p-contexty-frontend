import type { TNextPageWithLayout } from 'src/types/components';

import { useState } from 'react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider, EmotionCache } from '@emotion/react';

import { createTheme } from 'src/themes';
import createEmotionCache from 'src/createEmotionCache';

import ThemeConfigContext from 'src/contexts/ThemeConfigContext';
import NoLayout from 'src/components/Layout/NoLayout';

import 'src/styles/fontStyle.css';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface IMyAppPropsWithLayout extends AppProps {
	emotionCache?: EmotionCache;
	Component: TNextPageWithLayout;
}

export default function MyApp(props: IMyAppPropsWithLayout) {
	const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

	const PageLayout = Component.PageLayout ? Component.PageLayout : NoLayout;

	const [themeMode, setThemeMode] = useState('light');
	// cosnt value
	return (
		<CacheProvider value={emotionCache}>
			<Head>
				<title>Contexty</title>
				<meta name="viewport" content="initial-scale=1, width=device-width" />
			</Head>
			<ThemeConfigContext.Provider value={{ themeMode, setThemeMode }}>
				<ThemeProvider
					theme={createTheme({
						themeMode,
					})}
				>
					{/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
					<CssBaseline />
					<PageLayout>
						<Component {...pageProps} />
					</PageLayout>
				</ThemeProvider>
			</ThemeConfigContext.Provider>
		</CacheProvider>
	);
}
