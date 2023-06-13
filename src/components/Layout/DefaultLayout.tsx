import type { PropsWithChildren } from 'react';
import type { TNavItem } from 'src/types/components';

import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

import { Nav } from 'src/components/Nav';
import Footer from 'src/components/Footer';

const MainLayout = styled(Box)(({ theme }) => ({
	backgroundColor: theme.palette.background.default,
	paddingTop: '73px',
}));

const menuList: TNavItem['items'] = [
	{ name: 'Home', link: '/' },
	{ name: 'About', link: '/about' },
	{ name: 'Contact', link: '/contact' },
];

function DefaultLayout(props: PropsWithChildren) {
	return (
		<MainLayout>
			<header>
				<Nav items={menuList} />
			</header>

			<main>{props.children}</main>

			<footer>
				<Footer />
			</footer>
		</MainLayout>
	);
}

export default DefaultLayout;
