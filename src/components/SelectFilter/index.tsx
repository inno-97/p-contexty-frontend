import type { FC } from 'react';
import type { ISelectFilter } from 'src/types/components';
import { styled } from '@mui/material/styles';
import { TextField, InputAdornment, Autocomplete } from '@mui/material';
import { OutlinedInputProps } from '@mui/material/OutlinedInput';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const CustomAutoComplete = styled(Autocomplete)(({ theme }) => {
	return {
		width: '240px',
		input: {
			'&::placeholder': {
				color: theme.palette.grey[300],
				opacity: 1,
			},
		},
		'& .MuiOutlinedInput-root': {
			borderRadius: '100px',
			color: theme.palette.grey[300],
			'& fieldset': {
				borderColor: theme.palette.grey[100],
			},
			'&:hover fieldset': {
				borderColor: theme.palette.grey[100],
			},
			'&.Mui-focused fieldset': {
				borderColor: theme.palette.grey[100],
				borderWidth: '1px',
			},
		},
		'& .MuiOutlinedInput-root > .MuiInputAdornment-root': {
			width: '24px',
			height: '24px',
			margin: '7.5px 8px',
		},
	};
});

const CustomArrowDownIcon = styled(KeyboardArrowDownIcon)(({ theme }) => {
	return {
		color: theme.palette.grey[300],
	};
});

export const SelectFilter: FC<ISelectFilter> = ({
	id,
	options,
	onInputChange,
	label,
	StartIcon,
}) => (
	<CustomAutoComplete
		id={id}
		options={options}
		onInputChange={onInputChange}
		popupIcon={<CustomArrowDownIcon />}
		renderInput={(params) => (
			<TextField
				{...params}
				placeholder={label}
				InputLabelProps={{
					className: 'ctt_text_14 ctt_medium',
					shrink: false,
				}}
				variant="outlined"
				InputProps={
					{
						...params.InputProps,
						className: 'ctt_text_14 ctt_medium',
						startAdornment: (
							<InputAdornment position="start">{StartIcon}</InputAdornment>
						),
					} as Partial<OutlinedInputProps>
				}
				fullWidth
			/>
		)}
	/>
);

export default SelectFilter;
