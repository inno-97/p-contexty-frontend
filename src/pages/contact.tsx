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
					<Stack spacing={1} sx={{ mb: '40px' }}>
						<TextField
							fullWidth
							id="contact-name"
							label="이름을 입력해 주세요"
							type="name"
						/>
						<TextField
							fullWidth
							id="contact-from-email"
							label="이메일 주소를 입력해 주세요."
							type="email"
						/>
						<TextField
							fullWidth
							id="contact-contents"
							label="내용을 입력해 주세요."
							type="contents"
						/>
					</Stack>
					<SendButton onClick={handleDialogOpen}>
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
