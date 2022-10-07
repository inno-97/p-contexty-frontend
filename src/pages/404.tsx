import type { TNextPageWithLayout } from 'src/types/components';

import Image from 'next/image';
import { Box, Stack } from '@mui/material';

import DefaultLayout from 'src/components/Layout/DefaultLayout';
import { SubContentsLayer } from 'src/components/CustomLayer';
import { Writing, Paragraph } from 'src/components/Contents/Writing';

import Forbidden from '/public/forbidden.svg';
import ErrorCharacter from '/public/characters/404.png';

const ERROR404: TNextPageWithLayout = () => {
	return (
		<Box>
			<SubContentsLayer>
				<Stack
					height="100%"
					direction="column"
					justifyContent="center"
					alignItems="center"
					spacing={3}
				>
					<Box
						sx={{
							position: 'relative',
							height: '222px',
							width: '322px',
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'center',
						}}
					>
						<Image layout="fill" alt="forbidden image" src={Forbidden.src} />
						<Image
							layout="intrinsic"
							alt="404 Error Character"
							{...ErrorCharacter}
							width={322}
							height={130}
						/>
					</Box>
					<Writing className="ctt_text_14 ctt_regular" textAlign="center">
						<Paragraph className="ctt_text_18 ctt_bold" mb={8}>
							앗, 페이지를 찾지 못했어요.
						</Paragraph>
						페이지가 존재하지 않거나 이용할 수 없는 페이지예요.
						<br />
						입력한 주소를 다시 확인해 주세요.
					</Writing>
				</Stack>
			</SubContentsLayer>
		</Box>
	);
};

ERROR404.PageLayout = DefaultLayout;

export default ERROR404;
