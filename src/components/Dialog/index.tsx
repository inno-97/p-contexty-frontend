import type { FC } from 'react';
import type { IDialog } from 'src/types/components';

import { Dialog } from '@mui/material';

import { styled } from '@mui/material/styles';

const DialogBox = styled(Dialog)(({ theme }) => ({
	'& .MuiDialog-paper': {
		minWidth: 480,
		padding: theme.spacing(0),
	},
}));

export const CustomDialog: FC<IDialog> = ({ onClose, open, children }) => (
	<DialogBox open={open} onClose={onClose} aria-labelledby="custom-dialog" maxWidth={false}>
		{children}
	</DialogBox>
);

export default CustomDialog;
