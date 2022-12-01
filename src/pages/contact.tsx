import type { TypographyProps } from '@mui/material';
import type { TNextPageWithLayout } from 'src/types/components';

import { useState } from 'react';
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
	const [open, setOpen] = useState(false);

	const handleDialogClose = () => {
		setOpen(false);
	};

	const handleDialogOpen = () => {
		setOpen(true);
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
						<TextField fullWidth id="contact-name" label="이름" type="name" />
						<TextField fullWidth id="contact-from-email" label="이메일" type="email" />
						<TextField
							fullWidth
							multiline
							rows={6}
							id="contact-contents"
							label="내용"
							type="contents"
						/>
					</Stack>
					<SendButton variant="contained" onClick={handleDialogOpen}>
						<SendButtonText>보내기</SendButtonText>
					</SendButton>
				</Contents>
			</SubContentsLayer>
			<Dialog open={open} onClose={handleDialogClose}>
				<Box margin={'30px 30px'}>서비스 준비중입니다.</Box>
			</Dialog>
		</Box>
	);
};

Contact.PageLayout = DefaultLayout;

export default Contact;
