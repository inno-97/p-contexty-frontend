import type { TypographyProps } from '@mui/material';
import type { TNextPageWithLayout } from 'src/types/components';

import React, { useState } from 'react';
import { Box, Stack, TextField, Button, ButtonProps, Typography } from '@mui/material';
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

const SendButtonText = styled(({ ...props }: TypographyProps) => (
	<Typography {...props} className={props.className + ' ctt_text_16 ctt_bold'} />
))(({ theme }) => {
	return {
		color: theme.palette.mode === 'dark' ? 'black' : 'white',
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
				title: '',
				content: '이름을 입력 해주세요!',
				open: true,
			});

			return;
		}

		if (report.email === '') {
			setModal({
				title: '',
				content: '이메일을 입력 해주세요!',
				open: true,
			});

			return;
		}

		if (report.content === '') {
			setModal({
				title: '',
				content: '내용을 입력 해주세요!',
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
				title: '',
				content: '성공적으로 보냈습니다!',
				open: true,
			});
		}
	};

	return (
		<Box>
			<SubContentsLayer>
				<Contents title="Contact">
					<Writing className="ctt_text_16 ctt_regular">
						<Paragraph mb={24}>
							제보하고 싶은 서비스가 있거나 문의사항이 있다면 보내주세요.
						</Paragraph>
					</Writing>
					<Stack spacing={2} sx={{ mb: '40px' }}>
						<TextField
							fullWidth
							name="name"
							label="이름"
							value={report.name}
							onChange={handleChange}
						/>
						<TextField
							fullWidth
							name="email"
							label="이메일"
							value={report.email}
							onChange={handleChange}
						/>
						<TextField
							fullWidth
							multiline
							rows={6}
							name="content"
							label="내용"
							value={report.content}
							onChange={handleChange}
						/>
					</Stack>
					<SendButton variant="contained" onClick={handelSendEmail}>
						<SendButtonText>보내기</SendButtonText>
					</SendButton>
				</Contents>
			</SubContentsLayer>
			<Dialog open={modal.open} onClose={handleDialogClose}>
				<Box margin={'30px 30px'}>
					{modal.title} {modal.content}
				</Box>
			</Dialog>
		</Box>
	);
};

Contact.PageLayout = DefaultLayout;

export default Contact;
