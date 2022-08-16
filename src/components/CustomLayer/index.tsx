import type { FC, PropsWithChildren } from 'react';
import type { IDepthLayer } from 'src/types/components';

import { Box } from '@mui/material';

export const DepthLayer: FC<IDepthLayer> = ({ sx, depth = 0, children }) => {
	return <Box sx={{ ...sx, padding: `0 ${depth * 12}px` }}>{children}</Box>;
};

export const ContentsLayer: FC<PropsWithChildren> = ({ children }) => (
	<Box
		sx={{
			display: 'flex',
			justifyContent: 'center',
		}}
	>
		<DepthLayer
			sx={{
				width: '100%',
				maxWidth: '1280px',
			}}
			depth={2}
		>
			{children}
		</DepthLayer>
	</Box>
);

export const SubContentsLayer: FC<PropsWithChildren> = ({ children }) => (
	<Box
		sx={{
			display: 'flex',
			justifyContent: 'center',
		}}
	>
		<DepthLayer
			sx={{
				width: '100%',
				maxWidth: '864px',
				minHeight: '800px',
			}}
			depth={2}
		>
			{children}
		</DepthLayer>
	</Box>
);
