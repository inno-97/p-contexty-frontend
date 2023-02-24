import { FC, Fragment } from 'react';
import type { IUIDialogViewer } from 'src/types/components';

import { styled } from '@mui/material/styles';
import { Paper, Box, Stack, DialogContent, IconButton } from '@mui/material';

import { Close } from '@mui/icons-material';

import { Card, ReferenceCard } from 'src/components/Contents/Card';
import Dialog from 'src/components/Dialog';

const ImageLayout = styled(Paper)(({ theme }) => {
	return {
		width: '270px',
		height: '586px',
		borderRadius: '8px',
		border: `1px solid ${theme.palette.grey[100]}`,
		display: 'flex',
		justifyContent: 'center',
		position: 'relative',
	};
});

const DetailLayout = styled(Stack)({
	width: '488px',
});

const BottomLayout = styled(Box)({
	marginTop: '8px',
	// textAlign: 'right',
});

export const UIDialogViewer: FC<IUIDialogViewer> = ({
	open = false,
	onClose,
	ImageComponent = null,
	HeaderComponent = null,
	TextComponent = null,
	BottomComponent = null,
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

				<Stack direction="row" spacing={4}>
					{/* Image Box */}
					{ImageComponent && <ImageLayout elevation={0}>{ImageComponent}</ImageLayout>}
					{/* Detail Box */}
					<DetailLayout spacing={3}>
						{/* Detail Header Layout */}
						{HeaderComponent && HeaderComponent}
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
				{BottomComponent && <BottomLayout>{BottomComponent}</BottomLayout>}
			</DialogContent>
		</Dialog>
	);
};

export default UIDialogViewer;
