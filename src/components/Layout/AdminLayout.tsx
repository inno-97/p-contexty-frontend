import { Fragment, PropsWithChildren } from 'react';
import type { TNavItem } from 'src/types/components';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';

import { styled, useTheme } from '@mui/material/styles';
import {
	Box,
	AppBar,
	Toolbar,
	Drawer,
	Divider,
	IconButton,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Typography,
	TypographyProps,
} from '@mui/material';

import MenuIcon from '@mui/icons-material/Menu';
import LabelIcon from '@mui/icons-material/Label';
import ViewListIcon from '@mui/icons-material/ViewList';

import SVGLogo from '/public/logo.svg';

const drawerWidth = 225;

const menuList: TNavItem['items'] = [
	{ name: '데이터 관리', link: '/admin/ui-datas', icon: <ViewListIcon /> },
	{ name: '태그 관리', link: '/admin/tags', icon: <LabelIcon /> },
];

const Logo = styled(Image)(({ theme }) => {
	const filter = theme.palette.mode === 'dark' ? 'invert(1)' : undefined;
	return {
		textTransform: 'none',
		color: theme.palette.grey[400],
		cursor: 'pointer',
		filter,
	};
});

const LogoutText = styled(({ ...props }: TypographyProps) => (
	<Typography {...props} noWrap className={props.className + ' ctt_text_14 ctt_medium'} />
))(({ theme }) => {
	return {
		cursor: 'pointer',
		marginLeft: 'auto',
		color: theme.palette.grey[200],
	};
});

function AdminLayout(props: PropsWithChildren) {
	const theme = useTheme();
	const router = useRouter();

	const [mobileOpen, setMobileOpen] = useState(false);

	// 나중에 Provider로 감싸서 API 한곳에서 처리하자.
	useEffect(() => {
		fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/my`, {
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
			},
		})
			// .then((rs) => rs.json())
			.then(async (rs) => {
				if (rs.ok === true) {
					return await rs.json();
				} else {
					// login 페이지 이동
					router.push('/admin');
				}
			})
			.catch((e) => {
				console.error(e);
				alert('get my Profile Error');
			});
	}, []);

	const handleDrawerToggle = () => {
		setMobileOpen(!mobileOpen);
	};

	let now = null;

	const drawer = (
		<div>
			<Toolbar
				sx={{
					justifyContent: 'center',
				}}
			>
				{/* Contexty Logo */}
				<Link href={menuList[0].link}>
					<Logo alt="Contexty Logo" {...SVGLogo} />
				</Link>
			</Toolbar>
			<Divider />
			<List disablePadding>
				{menuList.map((item) => {
					const selected = item.link === router.pathname;

					if (selected) {
						now = item.name;
					}

					return (
						<Link key={item.name} href={item.link}>
							<ListItem disablePadding>
								<ListItemButton selected={selected}>
									<ListItemIcon>{item.icon}</ListItemIcon>
									<ListItemText primary={item.name} />
								</ListItemButton>
							</ListItem>
						</Link>
					);
				})}
			</List>
		</div>
	);

	return (
		<Fragment>
			<Box sx={{ display: 'flex' }} height={1}>
				<AppBar
					elevation={0}
					position="fixed"
					sx={{
						width: { sm: `calc(100% - ${drawerWidth}px)` },
						ml: { sm: `${drawerWidth}px` },
						borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
					}}
				>
					<Toolbar>
						<IconButton
							color="inherit"
							aria-label="open drawer"
							edge="start"
							onClick={handleDrawerToggle}
							sx={{ mr: 2, display: { sm: 'none' } }}
						>
							<MenuIcon />
						</IconButton>
						<Typography noWrap component="div" color={theme.palette.grey[400]}>
							{now}
						</Typography>
						<Link href={'/admin'}>
							<LogoutText>로그아웃</LogoutText>
						</Link>
					</Toolbar>
				</AppBar>
				<Box
					component="nav"
					sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
					aria-label="mailbox folders"
				>
					<Drawer
						variant="temporary"
						open={mobileOpen}
						onClose={handleDrawerToggle}
						ModalProps={{
							keepMounted: true, // Better open performance on mobile.
						}}
						sx={{
							display: { xs: 'block', sm: 'none' },
							'& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
						}}
					>
						{drawer}
					</Drawer>
					<Drawer
						variant="permanent"
						sx={{
							display: { xs: 'none', sm: 'block' },
							'& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
						}}
						open
					>
						{drawer}
					</Drawer>
				</Box>
			</Box>
			{/* Contents */}
			<Box
				sx={{
					width: `calc(100% - ${drawerWidth}px)`,
					marginLeft: `${drawerWidth}px`,
					marginTop: '73px',
					padding: '1em',
				}}
			>
				{props.children}
			</Box>
		</Fragment>
	);
}

export default AdminLayout;
