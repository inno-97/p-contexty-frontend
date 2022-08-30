import type { FC } from 'react';
import type { ButtonProps, DividerProps } from '@mui/material';
import type { IUITextComponent } from 'src/types/components';

import Image from 'next/image';
import { styled } from '@mui/material/styles';

import { Stack, Box, Button, Divider, Typography } from '@mui/material';

import { abbreviate } from 'src/utils/numberFomatter';

import CopySvg from '/public/copy.svg';

const HeaderBox = styled(Box)(({ theme }) => {
	return {
		color: theme.palette.grey[200],
	};
});

const TagsBox = styled(Box)(({ theme }) => {
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
		'& > .MuiTypography-root': {
			color: theme.palette.grey[200],
			marginLeft: '4px',
		},
	};
});

const TagsDivider = styled(({ ...props }: DividerProps) => (
	<Divider {...props} orientation="vertical" flexItem />
))({
	height: 10,
	display: 'inline-block',
	verticalAlign: 'middle',
	margin: '0 4px',
	borderColor: '#D9D9D9',
});

export const UITextData: FC<IUITextComponent> = ({ item, onCopy = true, onTags = true }) => {
	return (
		<Stack
			sx={{ height: '100%' }}
			direction="column"
			justifyContent="space-between"
			alignItems="flex-start"
			spacing={0}
		>
			<Box width="100%">
				{onTags === true && (
					<HeaderBox className="ctt_text_14 ctt_medium" mb={2}>
						<Stack
							direction="row"
							justifyContent="space-between"
							alignItems="center"
							spacing={0}
						>
							<Stack direction="row" spacing={1}>
								{item.tags?.events.map((event) => {
									const react_event_key = `${item.id}-${event.id}`;
									return <p key={react_event_key}>#{event.name}</p>;
								})}
							</Stack>
						</Stack>
					</HeaderBox>
				)}
				<TextBox className="ctt_text_18 ctt_bold">{item.text}</TextBox>
			</Box>
			{onCopy === true && (
				<Stack
					width="100%"
					mt={3}
					direction="row"
					justifyContent="space-between"
					alignItems="center"
				>
					<CopyButton
						onClick={async (e) => {
							e.preventDefault();
							e.stopPropagation();

							if (typeof navigator.clipboard == 'undefined') {
								const textArea = document.createElement('textarea');
								textArea.value = item.text;
								textArea.style.position = 'fixed'; //avoid scrolling to bottom
								document.body.appendChild(textArea);
								textArea.focus();
								textArea.select();

								try {
									const successful = document.execCommand('copy');
									if (successful) {
										// success
									} else {
										// failed
										console.log('Failed to copy text');
									}
								} catch (err) {
									console.error('Was not possible to copy te text: ', err);
								}

								document.body.removeChild(textArea);
								return;
							}

							navigator.clipboard.writeText(item.text).then(
								function () {
									// success
								},
								function () {
									// failed
									console.log('Failed to copy text');
								}
							);
						}}
					>
						Copy
						<Typography component="p" className="ctt_text_14 ctt_regular">
							{abbreviate(item.copyCount === 0 ? undefined : item.copyCount)}
						</Typography>
					</CopyButton>
					{onTags === true && (
						<TagsBox className="ctt_text_14 ctt_medium">
							{item.tags?.category.name}
							<TagsDivider />
							{item.tags?.service.name}
						</TagsBox>
					)}
				</Stack>
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
