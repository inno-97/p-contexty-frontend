import type { FC } from 'react';
import type { ButtonProps } from '@mui/material';
import type { IUITextComponent } from 'src/types/components';

import Image from 'next/image';
import { styled } from '@mui/material/styles';

import { Stack, Box, Button } from '@mui/material';

import CopySvg from '/public/copy.svg';

const HeaderBox = styled(Box)(({ theme }) => {
	return {
		color: theme.palette.grey[200],
	};
});

const TextBox = styled(Box)(({ theme }) => {
	return {
		color: theme.palette.grey[400],
	};
});

const CopyButton = styled(({ ...props }: ButtonProps) => (
	<Button
		{...props}
		disableFocusRipple
		disableElevation
		size="small"
		startIcon={<Image alt="Copy Button" {...CopySvg} />}
		className={props.className + ' ctt_text_14 ctt_medium'}
	/>
))(({ theme }) => {
	return {
		color: theme.palette.grey[300],
		backgroundColor: '#fff',
		textTransform: 'none',
		borderRadius: '8px',
		border: `1px solid ${theme.palette.grey[100]}`,
		padding: '6px 12px 6px 10px',
		'& .MuiButton-startIcon': {
			marginRight: '4px',
		},
	};
});

export const UITextData: FC<IUITextComponent> = ({ item, onCopy = true, onHeader = true }) => {
	return (
		<Stack
			sx={{ height: '100%' }}
			direction="column"
			justifyContent="space-between"
			alignItems="flex-start"
			spacing={0}
		>
			<Box sx={{ width: '100%' }}>
				{onHeader === true && (
					<HeaderBox className="ctt_text_14 ctt_medium" mb={2}>
						<Stack
							direction="row"
							justifyContent="space-between"
							alignItems="center"
							spacing={0}
						>
							<Stack direction="row" spacing={1}>
								<p>#{item.tags?.category.name}</p>
								{item.tags?.events.map((event) => {
									const react_event_key = `${item.id}-${event.id}`;
									return <p key={react_event_key}>#{event.name}</p>;
								})}
							</Stack>
							<Box>{item.tags?.service.name}</Box>
						</Stack>
					</HeaderBox>
				)}
				<TextBox className="ctt_text_18 ctt_bold">{item.text}</TextBox>
			</Box>
			{onCopy === true && (
				<Box mt={3}>
					<CopyButton>Copy</CopyButton>
				</Box>
			)}
		</Stack>
	);
};

export default UITextData;

export const UIRefTextData: FC<IUITextComponent> = ({ item }) => {
	return (
		<Box>
			<HeaderBox mb={1} className="ctt_text_14 ctt_bold">
				{item.tags?.service.name}
			</HeaderBox>
			<TextBox className="ctt_text_14 ctt_regular">{item.text}</TextBox>
		</Box>
	);
};
