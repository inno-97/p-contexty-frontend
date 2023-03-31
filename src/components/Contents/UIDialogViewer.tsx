import { FC, useState, Fragment } from 'react';
import type { TUITgas, IUITextData } from 'src/types/ui-data';
import type { IUIDialogViewer, IUITagsItem } from 'src/types/components';

import Image from 'next/image';
import { styled } from '@mui/material/styles';
import {
	Paper,
	Box,
	Stack,
	DialogContent,
	IconButton,
	TextField,
	Avatar,
	Divider,
	Menu,
	MenuItem,
	Fade,
} from '@mui/material';

import { Close, AddPhotoAlternate } from '@mui/icons-material';

import { UITextData, UIRefTextData } from 'src/components/Contents/UITextData';
import { Card, ReferenceCard } from 'src/components/Contents/Card';
import { NormalTagChip } from 'src/components/Tag/TagChip';
import Dialog from 'src/components/Dialog';

import { getUnixToYYYYMMDD } from 'src/utils/simpleDate';

import NoImage from '/public/noImage.svg';
import filter_category from '/public/filter/category.svg';
import filter_service from '/public/filter/service.svg';
import filter_situation from '/public/filter/situation.svg';

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

const RegistrationDate = styled('p')(({ theme }) => {
	return {
		color: theme.palette.grey[300],
	};
});

const FilterIcon = styled(Image)(({ theme }) => {
	const filter = theme.palette.mode === 'dark' ? 'invert(1)' : undefined;
	return {
		color: theme.palette.grey[400],
		filter,
	};
});

export const UIDialogViewer: FC<IUIDialogViewer> = ({
	open = false,
	write = false,
	data,
	tags,
	onClose,
	setData,
	onUITextCopy,
	BottomComponent = null,
}) => {
	const [noImage, setNoImage] = useState((data !== undefined && !data?.image) || false);

	const [tagMenu, setTagMenu] = useState<{
		target: null | HTMLElement;
		data: IUITagsItem[];
	}>({
		target: null,
		data: [],
	});

	const handleTagMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
		if (tags !== undefined) {
			setTagMenu({
				target: event.currentTarget,
				data: tags[event.currentTarget.id],
			});
		}
	};

	const handleTagMenuClose = () => {
		setTagMenu((prev) => {
			return {
				...prev,
				target: null,
			};
		});
	};

	const handleTagDelete = (id: number) => {
		if (setData == undefined) {
			throw 'setData(useState) is undefined';
		}
		setData((prev) => {
			if (prev?.tags?.events !== undefined) {
				const newEventsTags = [...prev.tags.events];
				const delIndex = newEventsTags.findIndex((item) => item.id === id);

				if (delIndex !== -1) {
					newEventsTags.splice(delIndex, 1);
					return {
						...prev,
						tags: {
							...prev.tags,
							events: newEventsTags,
						},
					};
				}
			}
			return prev;
		});
	};

	const handleTagChange = (tag: IUITagsItem) => {
		if (setData == undefined) {
			throw 'setData(useState) is undefined';
		}

		setData((prev) => {
			let newTags: TUITgas = {};
			if (prev.tags !== undefined) {
				newTags = {
					...prev.tags,
				};
			}

			const curTag = {
				type: tag.type,
				id: tag.id,
				name: tag.name,
			};

			if (tag.type === 'category' || tag.type === 'service') {
				newTags[tag.type] = curTag;
			} else if (tag.type === 'event') {
				if (
					newTags?.events &&
					newTags.events.findIndex((item) => item.id === tag.id) === -1
				) {
					newTags.events = [...newTags.events, curTag];
				} else {
					newTags.events = [curTag];
				}
			}

			return {
				...prev,
				tags: newTags,
			};
		});

		handleTagMenuClose();
	};

	const handleImageChange = (e: React.ChangeEvent) => {
		if (setData == undefined) {
			throw 'setData(useState) is undefined';
		}
		const targetFiles = (e.target as HTMLInputElement).files as FileList;

		const imageName = targetFiles[0].name;
		const imageSrc = URL.createObjectURL(targetFiles[0]);

		setData((prev) => {
			return {
				...prev,
				image: imageName,
				imageSrc: imageSrc,
				File: targetFiles[0],
			};
		});
	};

	const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
		if (setData == undefined) {
			throw 'setData(useState) is undefined';
		}

		setData((prev) => {
			return {
				...prev,
				text: e.target.value,
			};
		});
	};

	return (
		<Fragment>
			<Dialog open={open} onClose={onClose}>
				<DialogContent sx={{ padding: '40px' }}>
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
					{write ? (
						<Stack direction="row" spacing={4}>
							<ImageLayout elevation={0}>
								{noImage === false && (
									<Image
										alt="Text UI Data Image"
										width="270px"
										height="586px"
										// loader={previewIamgeLoader}
										style={{
											borderRadius: '8px',
										}}
										onError={(e) => {
											setNoImage(true);
										}}
										src={
											(data?.imageSrc && data?.imageSrc) ||
											`${process.env.NEXT_PUBLIC_STORAGE_URL}/ui-data/${data?.image}`
										}
									/>
								)}
								<Box
									sx={{
										height: 1,
										display: 'flex',
										position: 'absolute',
									}}
								>
									<IconButton
										sx={{ margin: 'auto', backgroundColor: '#6f6f6f30' }}
										component="label"
										onClick={(e) => {
											if (data?.tags?.service?.id === undefined) {
												e.preventDefault();
												alert(
													'이미지를 추가하기 전 서비스를 먼저 선택해 주세요.'
												);
											}
										}}
									>
										<input
											hidden
											accept="image/*"
											type="file"
											onChange={handleImageChange}
										/>
										<AddPhotoAlternate fontSize="large" />
									</IconButton>
								</Box>
							</ImageLayout>
							<DetailLayout spacing={3}>
								<Stack alignItems="center" direction="row" spacing={1}>
									{/* Category Tag */}
									<NormalTagChip
										id="categorys"
										onClick={handleTagMenuOpen}
										label={
											(data?.tags?.category && data?.tags?.category.name) || (
												<FilterIcon
													alt="App Category Filter"
													{...filter_category}
												/>
											)
										}
									/>

									{/* Service Tag */}
									<NormalTagChip
										id="services"
										onClick={handleTagMenuOpen}
										label={
											(data?.tags?.service && data?.tags?.service.name) || (
												<FilterIcon
													alt="App Service Filter"
													{...filter_service}
												/>
											)
										}
									/>
									<div>
										<Divider
											sx={{ height: 10 }}
											orientation="vertical"
											flexItem
										/>
									</div>
									{/* Event Tags*/}
									{data?.tags?.events?.map((event) => {
										const react_event_key = `new-${event.id}`;
										return (
											<NormalTagChip
												label={`#${event.name}`}
												key={react_event_key}
												onDelete={() => {
													handleTagDelete(event.id);
												}}
											/>
										);
									})}
									<NormalTagChip
										onClick={handleTagMenuOpen}
										id="events"
										label={
											<FilterIcon
												alt="App Events Filter"
												{...filter_situation}
											/>
										}
									/>
								</Stack>
								<Card
									sx={{
										padding: '24px',
										minHeight: '200px',
									}}
								>
									<TextField
										value={data?.text}
										fullWidth
										multiline
										minRows={3}
										sx={{
											marginBottom: '38px',
										}}
										placeholder="텍스트를 입력하세요!"
										onChange={handleTextChange}
									/>
								</Card>
							</DetailLayout>
						</Stack>
					) : (
						<Stack direction="row" spacing={4}>
							<ImageLayout elevation={0}>
								{/* 쓰기 모드가 아니고, 이미지가 없거나 로드중 에러가 발생한 경우 */}
								{noImage && (
									<Image
										style={{
											borderRadius: '8px',
										}}
										alt="No Image"
										{...NoImage}
									/>
								)}

								{/* 이미지 성공적으로 로드 되었을 때 */}
								{noImage === false && (
									<Image
										alt="Text UI Data Image"
										width="270px"
										height="586px"
										// loader={previewIamgeLoader}
										style={{
											borderRadius: '8px',
										}}
										onError={(e) => {
											setNoImage(true);
										}}
										src={
											(data?.imageSrc && data?.imageSrc) ||
											`${process.env.NEXT_PUBLIC_STORAGE_URL}/ui-data/${data?.image}`
										}
									/>
								)}
							</ImageLayout>
							<DetailLayout spacing={3}>
								<Stack alignItems="center" direction="row" spacing={1}>
									{/* Service Icon */}
									{data?.tags?.service?.icon || (
										<Avatar sx={{ width: 28, height: 28 }}> -</Avatar>
									)}
									{/* Service Name */}
									<NormalTagChip label={data?.tags?.service?.name} />
									<div>
										<Divider
											sx={{ height: 10 }}
											orientation="vertical"
											flexItem
										/>
									</div>
									{/* Event Tags*/}
									{data?.tags?.events?.map((event) => {
										const react_event_key = `${data.id}-${event.id}`;
										return (
											<NormalTagChip
												label={`#${event.name}`}
												key={react_event_key}
											/>
										);
									})}
									<div>
										<Divider
											sx={{ height: 10 }}
											orientation="vertical"
											flexItem
										/>
									</div>
									{/* Registration Date */}
									<RegistrationDate className="ctt_text_14 ctt_regular">
										{getUnixToYYYYMMDD(data?.timestamp)}
									</RegistrationDate>
								</Stack>
								<Card
									sx={{
										padding: '24px',
										minHeight: '200px',
									}}
								>
									{data !== undefined && onUITextCopy !== undefined ? (
										<UITextData
											item={data}
											onTags={false}
											handleCopy={onUITextCopy}
										/>
									) : (
										'선택된 데이터가 없습니다.'
									)}
								</Card>
							</DetailLayout>
						</Stack>
					)}
					{BottomComponent && <BottomLayout>{BottomComponent}</BottomLayout>}
				</DialogContent>
			</Dialog>
			<Menu
				id="long-menu"
				MenuListProps={{
					'aria-labelledby': 'long-button',
				}}
				anchorEl={tagMenu.target}
				open={Boolean(tagMenu.target)}
				onClose={handleTagMenuClose}
				PaperProps={{
					style: {
						maxHeight: 48 * 4.5,
						width: '20ch',
					},
				}}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'center',
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'center',
				}}
				TransitionComponent={Fade}
			>
				{tagMenu.data.map((tag) => {
					let selected = false;

					if (tag.type === 'event') {
						const find = data?.tags?.events?.findIndex((item) => item.id === tag.id);
						if (find !== undefined && find > -1) {
							selected = true;
						}
					} else if (tag.type === 'category' || tag.type === 'service') {
						const a = data?.tags;
						if (a) {
							selected = tag.id === a[tag.type]?.id;
						}
					}

					return (
						<MenuItem
							key={`new-${tag.id}`}
							onClick={handleTagChange.bind(null, tag)}
							selected={selected}
						>
							{tag.name}
						</MenuItem>
					);
				})}
			</Menu>
		</Fragment>
	);
};

export default UIDialogViewer;
