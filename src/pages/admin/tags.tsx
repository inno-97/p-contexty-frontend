import type { TNextPageWithLayout } from 'src/types/components';

import { Box } from '@mui/material';

import AdminLayout from 'src/components/Layout/AdminLayout';

const Tags: TNextPageWithLayout = () => {
	return <Box>tags 페이지</Box>;
};

Tags.PageLayout = AdminLayout;

export default Tags;
