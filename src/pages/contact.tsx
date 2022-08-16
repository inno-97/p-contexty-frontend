import type { TypographyProps } from '@mui/material';
import type { TNextPageWithLayout } from 'src/types/components';

import { Box, Stack, TextField, Button, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import DefaultLayout from 'src/components/Layout/DefaultLayout';
import { SubContentsLayer } from 'src/components/CustomLayer';
import { Writing, Paragraph } from 'src/components/Contents/Writing';
import Contents from 'src/components/Contents';

const SendButton = styled(Button)(({ theme }) => {
	return {
		backgroundColor: theme.palette.grey[400],
		padding: '20px 48px',
		borderRadius: '8px',
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
					<SendButton disableRipple={true}>
						<SendButtonText>보내기</SendButtonText>
					</SendButton>
				</Contents>
			</SubContentsLayer>
		</Box>
	);
};

Contact.PageLayout = DefaultLayout;

export default Contact;
