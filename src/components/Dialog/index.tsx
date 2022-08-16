import type { FC } from 'react';
import type { IDialog } from 'src/types/components';

import { styled } from '@mui/material/styles';
import { Dialog, DialogContent } from '@mui/material';

const DialogBox = styled(Dialog)(({ theme }) => ({
	'& .MuiDialogContent-root': {
		padding: theme.spacing(0),
	},
}));

export const CustomDialog: FC<IDialog> = ({ onClose, open, children }) => (
	<DialogBox open={open} onClose={onClose} aria-labelledby="custom-dialog" maxWidth={false}>
		<DialogContent>{children}</DialogContent>
	</DialogBox>
);

export default CustomDialog;
