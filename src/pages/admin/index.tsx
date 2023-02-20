import Image from 'next/image';
import { useRouter } from 'next/router';

import { Formik, Form, FormikHelpers } from 'formik';

import type { TNextPageWithLayout } from 'src/types/components';

import {
	Container,
	Stack,
	TextField,
	Button,
	ButtonProps,
	Typography,
	TypographyProps,
} from '@mui/material';
import { styled } from '@mui/material/styles';

import NoLayout from 'src/components/Layout/NoLayout';

import SVGLogo from '/public/big_logo.svg';

const Logo = styled(Image)(({ theme }) => {
	const filter = theme.palette.mode === 'dark' ? 'invert(1)' : undefined;
	return {
		textTransform: 'none',
		color: theme.palette.grey[400],
		filter,
	};
});

const SendButton = styled(({ ...props }: ButtonProps) => (
	<Button
		{...props}
		fullWidth
		disableFocusRipple
		disableElevation
		className={props.className + ' ctt_text_14 ctt_medium'}
	/>
))(({ theme }) => {
	return {
		backgroundColor: theme.palette.grey[400],
		textTransform: 'none',
		borderRadius: '8px',
		padding: '20px 48px',
		'&:hover': {
			backgroundColor: '#495057',
		},
	};
});

const ButtonText = styled(({ ...props }: TypographyProps) => (
	<Typography {...props} className={props.className + ' ctt_text_16 ctt_bold'} />
))(({ theme }) => {
	return {
		color: theme.palette.mode === 'dark' ? 'black' : 'white',
	};
});

interface Values {
	uid: string;
	password: string;
}

const Admin: TNextPageWithLayout = () => {
	const router = useRouter();

	return (
		<Formik
			initialValues={{
				uid: '',
				password: '',
			}}
			onSubmit={(values: Values, { setSubmitting }: FormikHelpers<Values>) => {
				setTimeout(() => {
					fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/sign-in`, {
						method: 'POST',
						credentials: 'include',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({
							uid: values.uid,
							password: values.password,
						}),
					})
						.then((rs) => {
							if (rs.status !== 200) {
								alert('아이디 또는 패스워드를 확인해주세요');
							} else {
								router.push('/admin/ui-datas');
							}
						})
						.catch((e) => {
							console.log(e);
							alert('로그인 실패');
						})
						.finally(() => {
							setSubmitting(false);
						});
				}, 500);
			}}
		>
			{({ values, handleChange, isSubmitting }) => (
				<Form>
					<Container
						maxWidth="sm"
						sx={{
							height: '100vh',
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
						}}
					>
						<Stack
							direction="column"
							justifyContent="center"
							alignItems="center"
							spacing={1}
							width={380}
							paddingBottom="6em"
						>
							<Logo alt="Contexty Logo" {...SVGLogo} width={215} height={85} />
							<TextField
								fullWidth
								id="uid"
								name="uid"
								label="아이디"
								value={values.uid}
								onChange={handleChange}
							/>
							<TextField
								fullWidth
								type="password"
								id="password"
								name="password"
								label="패스워드"
								value={values.password}
								onChange={handleChange}
							/>
							<SendButton type="submit" variant="contained" disabled={isSubmitting}>
								<ButtonText>로그인</ButtonText>
							</SendButton>
						</Stack>
					</Container>
				</Form>
			)}
		</Formik>
	);
};

Admin.PageLayout = NoLayout;

export default Admin;
