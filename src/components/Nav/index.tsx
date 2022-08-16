import type { FC } from 'react';
import type { ButtonProps } from '@mui/material';
import type { TNavItem } from 'src/types/components';

import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';

import { AppBar, Box, Toolbar, Button } from '@mui/material';
import { styled } from '@mui/material/styles';

import { ContentsLayer } from 'src/components/CustomLayer';
import ToggleThemeMode from 'src/components/ToggleThemeMode';

import SVGLogo from '/public/logo.svg';

const MenuButton = styled(({ ...props }: ButtonProps) => (
	<Button
		{...props}
		variant="text"
		disableRipple={true}
		className={props.className + ' ctt_text_16 ctt_bold'}
	/>
))(({ theme }) => ({
	textTransform: 'none',
	color: theme.palette.grey[400],
	paddingRight: 20,
	paddingLeft: 20,
}));

// Netx.js Link React.forwardRef issue
const MenuAnchorTag = styled('a')`
	text-decoration: none;
`;

const Logo = styled(Image)(({ theme }) => {
	const filter = theme.palette.mode === 'dark' ? 'invert(1)' : undefined;
	return {
		textTransform: 'none',
		color: theme.palette.grey[400],
		filter,
	};
});

export const Nav: FC<TNavItem> = (props) => {
	const router = useRouter();

	const navItems = props.items;

	return (
		<AppBar elevation={0} component="nav">
			<ContentsLayer>
				<Toolbar
					disableGutters
					sx={{
						height: '73px',
					}}
				>
					{/* Contexty Logo */}
					<Logo alt="Contexty Logo" {...SVGLogo} />
					<Box
						sx={{
							flexGrow: 1,
						}}
					></Box>
					<Box>
						{navItems.map((item) => {
							const opacity = item.link === router.pathname ? '' : '0.3';

							return (
								<Link key={item.name} href={item.link}>
									<MenuAnchorTag>
										<MenuButton sx={{ opacity }}>{item.name}</MenuButton>
									</MenuAnchorTag>
								</Link>
							);
						})}
					</Box>
					{/* 서비스 오픈 후 예정 */}
					{/* <ToggleThemeMode /> */}
				</Toolbar>
			</ContentsLayer>
		</AppBar>
	);
};

export default Nav;
