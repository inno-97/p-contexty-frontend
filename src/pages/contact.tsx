import type { TypographyProps } from '@mui/material';
import type { TNextPageWithLayout } from 'src/types/components';

import React, { useState } from 'react';
import {
	Box,
	Stack,
	TextField,
	Button,
	ButtonProps,
	Typography,
	DialogTitle,
	DialogTitleProps,
	DialogContentText,
	DialogContentTextProps,
	DialogActions,
} from '@mui/material';
import { styled } from '@mui/material/styles';

import DefaultLayout from 'src/components/Layout/DefaultLayout';
import { SubContentsLayer } from 'src/components/CustomLayer';
import { Writing, Paragraph } from 'src/components/Contents/Writing';
import Contents from 'src/components/Contents';
import Dialog from 'src/components/Dialog';

const SendButton = styled(({ ...props }: ButtonProps) => (
	<Button
		{...props}
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

const CDialogTitle = styled(({ ...props }: DialogTitleProps) => (
	<DialogTitle {...props} className={props.className + ' ctt_text_22 ctt_bold'} />
))(({ theme }) => {
	return {
		padding: theme.spacing(0),
		marginBottom: theme.spacing(1),
	};
});

const CheckButton = styled(({ ...props }: ButtonProps) => (
	<Button
		{...props}
		disableFocusRipple
		disableElevation
		className={props.className + ' ctt_text_14 ctt_medium'}
	/>
))(({ theme }) => {
	return {
		backgroundColor: theme.palette.grey[400],
		textTransform: 'none',
		borderRadius: '8px',
		padding: '16px 40px',
		'&:hover': {
			backgroundColor: '#495057',
		},
	};
});

const CDialogContentText = styled(({ ...props }: DialogContentTextProps) => (
	<DialogContentText {...props} className={props.className + ' ctt_text_14 ctt_regular'} />
))(({ theme }) => {
	return {
		color: theme.palette.grey[400],
		marginBottom: theme.spacing(6),
	};
});

const Contact: TNextPageWithLayout = () => {
	const [modal, setModal] = useState({
		open: false,
		title: '',
		content: '',
	});

	const [report, setReport] = useState({
		name: '',
		email: '',
		content: '',
	});

	const handleDialogClose = () => {
		setModal((prev) => {
			return {
				...prev,
				open: false,
			};
		});
	};

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		event.preventDefault();
		setReport((prev) => {
			return {
				...prev,
				[event.target.name]: event.target.value,
			};
		});
	};

	const handelSendEmail = async () => {
		if (report.name === '') {
			setModal({
				title: '?????? ??????!',
				content: '????????? ?????? ????????????!',
				open: true,
			});

			return;
		}

		if (report.email === '') {
			setModal({
				title: '?????? ??????!',
				content: '???????????? ?????? ????????????!',
				open: true,
			});

			return;
		}

		if (report.content === '') {
			setModal({
				title: '?????? ??????!',
				content: '????????? ?????? ????????????!',
				open: true,
			});

			return;
		}

		const sendEmail = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/report-email`, {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				...report,
			}),
		});

		if (sendEmail.status === 200) {
			setModal({
				title: '?????? ??????!',
				content: '?????? ?????? ??????????????? ????????????.\n???????????? ????????? ????????? ??? ???????????????.',
				open: true,
			});

			setReport({
				name: '',
				email: '',
				content: '',
			});
		}
	};

	return (
		<Box>
			<SubContentsLayer>
				<Contents title="Contact">
					<Writing className="ctt_text_16 ctt_regular">
						<Paragraph mb={24}>
							???????????? ?????? ???????????? ????????? ??????????????? ????????? ???????????????.
						</Paragraph>
					</Writing>
					<Stack spacing={2} sx={{ mb: '40px' }}>
						<TextField
							fullWidth
							name="name"
							label="??????"
							value={report.name}
							onChange={handleChange}
						/>
						<TextField
							fullWidth
							name="email"
							label="?????????"
							value={report.email}
							onChange={handleChange}
						/>
						<TextField
							fullWidth
							multiline
							rows={6}
							name="content"
							label="??????"
							value={report.content}
							onChange={handleChange}
						/>
					</Stack>
					<SendButton variant="contained" onClick={handelSendEmail}>
						<ButtonText>?????????</ButtonText>
					</SendButton>
				</Contents>
			</SubContentsLayer>
			<Dialog open={modal.open} onClose={handleDialogClose}>
				<Box padding="32px">
					<CDialogTitle>{modal.title}</CDialogTitle>
					{/* <DialogContent> */}
					<pre>
						<CDialogContentText>{modal.content}</CDialogContentText>
					</pre>
					<DialogActions
						sx={{
							padding: 0,
						}}
					>
						<CheckButton onClick={handleDialogClose}>
							<ButtonText>??????</ButtonText>
						</CheckButton>
					</DialogActions>
				</Box>
			</Dialog>
		</Box>
	);
};

Contact.PageLayout = DefaultLayout;

export default Contact;
