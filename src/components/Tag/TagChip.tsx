import type { ITagChip } from 'src/types/components';

import { FC } from 'react';
import { styled } from '@mui/material/styles';
import { Chip, ChipProps } from '@mui/material';
import { Close } from '@mui/icons-material';

export const SmallTagChip = styled(({ ...props }: ChipProps) => (
	<Chip
		{...props}
		className={props.className + ' ctt_text_12 ctt_medium'}
		deleteIcon={<Close />}
	/>
))({
	padding: '4px 12px',
	height: 'auto',
	borderRadius: '100px',
	'& .MuiSvgIcon-root': {
		fontSize: '14px',
		color: 'inherit',
		margin: '4px 0 4px 4px',
	},
	'& .MuiChip-label': {
		padding: 0,
	},
});

export const MediumChip = styled(({ ...props }: ChipProps) => (
	<Chip {...props} className={props.className + ' ctt_text_14 ctt_bold'} deleteIcon={<Close />} />
))({
	padding: '8px 16px',
	height: 'auto',
	borderRadius: '100px',
	'& .MuiSvgIcon-root': {
		fontSize: '16px',
		color: 'inherit',
		margin: '4px 0 4px 8px',
	},
	'& .MuiChip-label': {
		padding: 0,
	},
});

const tagStyle = {
	category: ['#ECF6FE', '#2196F3'],
	service: ['#E6F9EA', '#3BD569'],
	events: ['#FEF3E0', '#FB9600'],
};

export const TagChip: FC<ITagChip> = ({
	size = 'medium',
	type,
	label,
	value,
	margin,
	onDelete,
}) => {
	const Chip = size === 'medium' ? MediumChip : SmallTagChip;
	return (
		<Chip
			defaultValue={value}
			label={label}
			sx={{
				backgroundColor: tagStyle[type][0],
				color: tagStyle[type][1],
				margin: margin,
			}}
			onDelete={onDelete}
		/>
	);
};

export default TagChip;
