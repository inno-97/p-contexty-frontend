import type { FC } from 'react';
import type { IContentsCard } from 'src/types/components';

import { Paper } from '@mui/material';

export const Card: FC<IContentsCard> = ({ sx, onClick, children }) => {
	return (
		<Paper elevation={0} sx={{ ...sx, borderRadius: '16px' }} onClick={onClick}>
			{children}
		</Paper>
	);
};

export const ReferenceCard: FC<IContentsCard> = ({ sx, onClick, children }) => {
	return (
		<Paper elevation={0} sx={{ ...sx, borderRadius: '8px' }} onClick={onClick}>
			{children}
		</Paper>
	);
};

export default Card;
