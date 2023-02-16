import { styled } from '@mui/material/styles';
import { Chip, ChipProps } from '@mui/material';
import { Close } from '@mui/icons-material';

const TagChip = styled(({ ...props }: ChipProps) => (
	<Chip
		{...props}
		// size="small"
		className={props.className + ' ctt_text_14 ctt_bold'}
		deleteIcon={<Close />}
	/>
))({
	marginRight: '8px',
	padding: '8px 16px',
	height: 'auto',
	borderRadius: '100px',
	'& .MuiSvgIcon-root': {
		fontSize: '16px',
		color: 'inherit',
		margin: '4px 0',
	},
	'& .MuiChip-label': {
		padding: 0,
		paddingRight: '8px',
	},
});

export default TagChip;
