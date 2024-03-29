import type { FC } from 'react';
import type { ButtonProps, DividerProps } from '@mui/material';
import type { IUITextComponent } from 'src/types/components';

import { Fragment, useState, useEffect } from 'react';
import Image from 'next/image';
import { styled } from '@mui/material/styles';

import { Stack, Box, Button, Divider, Typography, ClickAwayListener } from '@mui/material';

import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';

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
		whiteSpace: 'pre-line',
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

const BootstrapTooltip = styled(({ className, ...props }: TooltipProps) => (
	<Tooltip
		{...props}
		PopperProps={{
			disablePortal: true,
		}}
		disableFocusListener
		disableHoverListener
		disableTouchListener
		arrow
		placement="top"
		classes={{ popper: className, tooltip: 'ctt_text_14 ctt_medium' }}
	/>
))(({ theme }) => ({
	[`& .${tooltipClasses.arrow}`]: {
		color: theme.palette.grey[400],
	},
	[`& .${tooltipClasses.tooltip}`]: {
		color: '#F8F9FA',
		backgroundColor: theme.palette.grey[400],
		padding: '8px 12px',
		borderRadius: '8px',
	},
}));

const TagsDivider = styled(({ ...props }: DividerProps) => (
	<Divider {...props} orientation="vertical" flexItem />
))({
	height: 10,
	display: 'inline-block',
	verticalAlign: 'middle',
	margin: '0 4px',
	borderColor: '#D9D9D9',
});

export const UITextData: FC<IUITextComponent> = ({
	item,
	onCopy = true,
	onTags = true,
	handleCopy,
}) => {
	const [open, setOpen] = useState(false);

	const [message, setMessage] = useState('복사했어요!');

	const handleTooltip = (message: string) => {
		setMessage(message);
		setOpen(true);
	};

	const successCopy = () => {
		if (!!item.id) {
			handleCopy(item.id, handleTooltip);
		}
	};

	const handleCloseTooltip = () => {
		setOpen(false);
	};

	useEffect(() => {
		const closeTooltip = window.setTimeout(() => {
			setOpen(false);
		}, 2500);

		return () => window.clearTimeout(closeTooltip);
	}, [open]);

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
								{item?.tags?.events?.map((event) => {
									const react_event_key = `${item.id}-${event.id}`;
									return <p key={react_event_key}>#{event.name}</p>;
								})}
							</Stack>
						</Stack>
					</HeaderBox>
				)}
				<TextBox className="ctt_text_16 ctt_medium">{item.text}</TextBox>
			</Box>
			{onCopy === true && (
				<Stack
					width="100%"
					mt={3}
					direction="row"
					justifyContent="space-between"
					alignItems="center"
				>
					<ClickAwayListener onClickAway={handleCloseTooltip}>
						<div>
							<BootstrapTooltip title={<Fragment>{message}</Fragment>} open={open}>
								<div>
									<CopyButton
										onClick={async (e) => {
											e.preventDefault();
											e.stopPropagation();

											if (typeof navigator.clipboard == 'undefined') {
												const textArea = document.createElement('textarea');
												textArea.value = item.text || 'No Data';
												textArea.style.position = 'fixed'; //avoid scrolling to bottom
												document.body.appendChild(textArea);
												textArea.focus();
												textArea.select();

												try {
													const successful = document.execCommand('copy');
													if (successful) {
														// success
														successCopy();
													} else {
														// failed
														handleTooltip('복사하지 못했어요!');
													}
												} catch (err) {
													console.error(
														'Was not possible to copy te text: ',
														err
													);
												}

												document.body.removeChild(textArea);
												return;
											}

											navigator.clipboard
												.writeText(item.text || 'No Data')
												.then(successCopy, function () {
													// failed
													handleTooltip('복사하지 못했어요!');
												});
										}}
									>
										Copy
										<Typography
											component="p"
											className="ctt_text_14 ctt_regular"
										>
											{abbreviate(item.copyCount || undefined)}
										</Typography>
									</CopyButton>
								</div>
							</BootstrapTooltip>
						</div>
					</ClickAwayListener>
					{onTags === true && (
						<TagsBox className="ctt_text_14 ctt_medium">
							{item.tags?.category?.name}
							<TagsDivider />
							{item.tags?.service?.name}
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
				{item.tags?.service?.name}
			</HeaderBox>
			<TextBox className="ctt_text_14 ctt_regular">{item.text}</TextBox>
		</Box>
	);
};
