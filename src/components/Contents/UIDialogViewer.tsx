import type { FC } from 'react';
import type { IUIDialogViewer } from 'src/types/components';

import { styled } from '@mui/material/styles';
import {
	Paper,
	Stack,
	DialogContent,
	Chip,
	ChipProps,
	IconButton,
	Avatar,
	Divider,
} from '@mui/material';

import { Close } from '@mui/icons-material';

import { Card, ReferenceCard } from 'src/components/Contents/Card';
import Dialog from 'src/components/Dialog';

import { getUnixToYYYYMMDD } from 'src/utils/simpleDate';

const ImageLayout = styled(Paper)(({ theme }) => {
	return {
		width: '270px',
		height: '586px',
		borderRadius: '8px',
		border: `1px solid ${theme.palette.grey[100]}`,
		display: 'flex',
		justifyContent: 'center',
	};
});

const DetailLayout = styled(Stack)({
	width: '488px',
});

const TagChip = styled(({ ...props }: ChipProps) => (
	<Chip {...props} className={props.className + ' ctt_text_14 ctt_bold'} />
))(({ theme }) => {
	return {
		color: theme.palette.grey[200],
	};
});

const RegistrationDate = styled('p')(({ theme }) => {
	return {
		color: theme.palette.grey[300],
	};
});

export const UIDialogViewer: FC<IUIDialogViewer> = ({
	open = false,
	onClose,
	data,
	ImageComponent = null,
	TextComponent = null,
}) => {
	return (
		<Dialog open={open} onClose={onClose}>
			{/* Display Contents Detail */}
			<DialogContent sx={{ padding: '40px' }}>
				{/* Close Button */}
				<IconButton
					aria-label="close"
					onClick={onClose}
					sx={{
						position: 'absolute',
						right: 6,
						top: 6,
						color: (theme) => theme.palette.grey[400],
					}}
				>
					<Close fontSize="large" />
				</IconButton>
				{data === undefined ? (
					'NO DATA'
				) : (
					<Stack direction="row" spacing={4}>
						{/* Image Box */}
						<ImageLayout elevation={0}>{ImageComponent && ImageComponent}</ImageLayout>
						{/* Detail Box */}
						<DetailLayout spacing={3}>
							{/* Header */}
							<Stack alignItems="center" direction="row" spacing={1}>
								{/* Service Icon */}
								{data.tags?.service.icon || (
									<Avatar sx={{ width: 28, height: 28 }}> -</Avatar>
								)}
								{/* Service Name */}
								<TagChip label={data.tags?.service.name} />
								<div>
									<Divider sx={{ height: 10 }} orientation="vertical" flexItem />
								</div>
								{/* Event Tags*/}
								{data.tags?.events.map((event) => {
									const react_event_key = `${data.id}-${event.id}`;
									return (
										<TagChip label={`#${event.name}`} key={react_event_key} />
									);
								})}
								<div>
									<Divider sx={{ height: 10 }} orientation="vertical" flexItem />
								</div>
								{/* Registration Date */}
								<RegistrationDate className="ctt_text_14 ctt_regular">
									{getUnixToYYYYMMDD(data.timestamp)}
								</RegistrationDate>
							</Stack>
							{/* Text */}
							{TextComponent && (
								<Card
									sx={{
										padding: '24px',
										minHeight: '200px',
									}}
								>
									{TextComponent}
								</Card>
							)}
							{/* Reference */}
							{/* 서비스 오픈 후 예정 */}
							{/* <Box>
									<ViewReferenceText>
										비슷한 상황에서 다른 서비스들은 이렇게 써요.
									</ViewReferenceText>

									<Grid container spacing={1}>
										{ReferenceCardTest.map((item) => {
											return (
												<Grid item key={item} xs={12} sm={6}>
													<ReferenceCard
														sx={{
															padding: '16px',
															maxHeight: '124px',
															minHeight: '124px',
														}}
													>
														<UIRefTextData
															item={{
																id: parseInt(item),
																text: 'RefData',
																tags: {
																	service: {
																		id: 1,
																		name: '컨텍스트',
																	},
																},
															}}
														/>
													</ReferenceCard>
												</Grid>
											);
										})}
									</Grid>
								</Box> */}
						</DetailLayout>
					</Stack>
				)}
			</DialogContent>
		</Dialog>
	);
};

export default UIDialogViewer;
