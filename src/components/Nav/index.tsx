import type { FC } from 'react';
import type { ButtonProps } from '@mui/material';
import type { TNavItem } from 'src/types/components';

import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import React, { useState } from 'react';

import { AppBar, Box, Toolbar, IconButton, Button, Menu } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { styled, useTheme } from '@mui/material/styles';

import { ContentsLayer } from 'src/components/CustomLayer';
// import ToggleThemeMode from 'src/components/ToggleThemeMode';

import SVGLogo from '/public/logo.svg';

const MenuButton = styled(({ ...props }: ButtonProps) => (
	<Button
		{...props}
		variant="text"
		disableRipple={true}
		className={props.className + ' ctt_text_16 ctt_bold'}
	/>
))({
	textTransform: 'none',
	paddingRight: 20,
	paddingLeft: 20,
});

// Netx.js Link React.forwardRef issue
const MenuAnchorTag = styled('a')(({ theme }) => {
	return {
		textDecoration: 'none',
		[theme.breakpoints.down('sm')]: {
			'& > a': {
				display: 'none',
			},
		},
	};
});

const Logo = styled(Image)(({ theme }) => {
	const filter = theme.palette.mode === 'dark' ? 'invert(1)' : undefined;
	return {
		textTransform: 'none',
		color: theme.palette.grey[400],
		cursor: 'pointer',
		filter,
	};
});

export const Nav: FC<TNavItem> = (props) => {
	const theme = useTheme();
	const router = useRouter();

	const navItems = props.items;

	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);
	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	const menu = navItems.map((item) => {
		const color =
			item.link === router.pathname ? theme.palette.grey[400] : theme.palette.grey[200];

		return (
			<Link key={item.name} href={item.link}>
				<MenuAnchorTag>
					<MenuButton sx={{ color }} onClick={handleClose}>
						{item.name}
					</MenuButton>
				</MenuAnchorTag>
			</Link>
		);
	});

	return (
		<AppBar elevation={0} component="nav">
			<ContentsLayer>
				<Toolbar disableGutters>
					{/* Contexty Logo */}
					<Link href="/">
						<Logo alt="Contexty Logo" {...SVGLogo} />
					</Link>
					<Box
						sx={{
							flexGrow: 1,
						}}
					></Box>
					<Box sx={{ display: { xs: 'none', sm: 'block' } }}>{menu}</Box>
					<IconButton
						id="basic-button"
						aria-controls={open ? 'basic-menu' : undefined}
						aria-haspopup="true"
						aria-expanded={open ? 'true' : undefined}
						disableRipple
						sx={{ pr: 0, display: { sm: 'none' } }}
						onClick={handleClick}
					>
						<MenuIcon />
					</IconButton>
					<Menu
						id="basic-menu"
						anchorEl={anchorEl}
						open={open}
						onClose={handleClose}
						MenuListProps={{
							'aria-labelledby': 'basic-button',
							sx: {
								[theme.breakpoints.down('sm')]: {
									'& > a': {
										display: 'block',
									},
								},
							},
						}}
						sx={{ display: { sm: 'none' } }}
					>
						{menu}
					</Menu>
					{/* 서비스 오픈 후 예정 */}
					{/* <ToggleThemeMode /> */}
				</Toolbar>
			</ContentsLayer>
		</AppBar>
	);
};

export default Nav;
