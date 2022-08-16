import type { FC } from 'react';
import type { IContents } from 'src/types/components';

import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

const ContentsTitle = styled('p')({
	margin: '40px 0',
});

export const Contents: FC<IContents> = ({ title = null, children }) => {
	return (
		<Box>
			{title !== null && (
				<ContentsTitle className="ctt_text_40 ctt_bold">{title}</ContentsTitle>
			)}
			{children}
		</Box>
	);
};

export default Contents;
