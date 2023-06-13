import type { FC } from 'react';
import type { ISelectFilter } from 'src/types/components';

import { useState } from 'react';
import { styled } from '@mui/material/styles';
import { TextField, InputAdornment, Autocomplete } from '@mui/material';
import { OutlinedInputProps } from '@mui/material/OutlinedInput';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const CustomAutoComplete = styled(Autocomplete)(({ theme }) => {
	return {
		'& .Mui-disabled': {
			background: '#F8F9FA',
		},
		width: '100%',
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
				borderColor: theme.palette.grey[300],
				transition: '0.1s linear',
			},
			'&.Mui-focused fieldset': {
				borderColor: theme.palette.grey[300],
				transition: '0.1s linear',
				borderWidth: '1px',
			},
			'&.Mui-disabled fieldset': {
				borderColor: '#F8F9FA',
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

const CustomList = styled('li')(({ theme }) => {
	return {
		color: theme.palette.grey[400],
	};
});

const hasTagItem = (opt: unknown): opt is { value: string | number; label: string } => {
	return typeof opt === 'object' && opt !== null && 'value' in opt && 'label' in opt;
};

export const SelectFilter: FC<ISelectFilter> = ({
	id,
	disabled,
	options,
	onOptionClick,
	label,
	StartIcon,
}) => {
	const [open, setOpen] = useState(false);
	return (
		<CustomAutoComplete
			id={id}
			disabled={disabled}
			options={options}
			value={null}
			open={open}
			onChange={(e, newValue) => {
				if (hasTagItem(newValue)) {
					if (onOptionClick !== undefined) {
						onOptionClick(newValue.value);
					}
				}
			}}
			onOpen={() => {
				setOpen(true);
			}}
			onClose={() => {
				setOpen(false);
			}}
			renderOption={(props, option) => {
				if (hasTagItem(option)) {
					return (
						<CustomList
							{...props}
							onClick={(e) => {
								setOpen(false);
								if (onOptionClick !== undefined) {
									onOptionClick(e.currentTarget.getAttribute('value'));
								}
							}}
							className={`ctt_text_14 ctt_regular ${props.className}`}
							style={{
								padding: '12px 16px',
							}}
							value={option.value}
						>
							{option.label}
						</CustomList>
					);
				}
			}}
			componentsProps={{
				paper: {
					style: {
						borderRadius: '16px',
						background: '#ffffff',
						boxShadow: '0px 12px 32px rgba(0, 0, 0, 0.16)',
					},
				},
			}}
			ListboxProps={{
				style: {
					padding: '8px',
				},
			}}
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
};

export default SelectFilter;
