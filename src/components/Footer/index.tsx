import type { FC } from 'react';

import { styled } from '@mui/material/styles';
import { Box, Divider } from '@mui/material';

import { ContentsLayer } from 'src/components/CustomLayer';

const FooterBox = styled(Box)(() => ({
	marginTop: '16px',
	height: '42px',
	display: 'flex',
}));

const ContributorsBox = styled(Box)(({ theme }) => ({
	color: theme.palette.grey[300],
	flexGrow: 1,
}));

const ContributorsTitle = styled('span')(() => ({
	display: 'block',
	fontWeight: '700',
}));

const Contributor = styled('span')({
	marginRight: '16px',
	display: 'inline-block',
});

const CopyrightBox = styled(Box)(({ theme }) => ({
	color: theme.palette.grey[100],
	display: 'flex',
	flexDirection: 'column-reverse',
}));

const TestContributors = ['최유진', '김범석', '김예지', '이규민'];

export const Footer: FC = () => {
	return (
		<ContentsLayer>
			<Box sx={{ height: '147px' }}>
				<Divider />
				<FooterBox>
					{/* Contributors */}
					<ContributorsBox className="ctt_text_14 ctt_regular">
						<ContributorsTitle className="ctt_bold">Contributors</ContributorsTitle>
						{TestContributors.map((item) => {
							return <Contributor key={item}>{item}</Contributor>;
						})}
					</ContributorsBox>
					{/* Copyright */}
					<CopyrightBox className="ctt_text_12 ctt_medium">
						<p>© 2022 Contexty ALL RIGHTS RESERVED</p>
					</CopyrightBox>
				</FooterBox>
			</Box>
		</ContentsLayer>
	);
};

export default Footer;
