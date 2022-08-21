import type { TypographyProps, ChipProps } from '@mui/material';
import type { TNextPageWithLayout, IUITagCoponents } from 'src/types/components';
import type { IUIDatas, IUITextData } from 'src/types/ui-data';

import { useState, useEffect, Fragment } from 'react';
import Image from 'next/image';
import { styled } from '@mui/material/styles';
import {
	Box,
	Grid,
	Paper,
	Stack,
	TextField,
	IconButton,
	InputAdornment,
	Typography,
	Divider,
	Avatar,
	Chip,
	Grow,
} from '@mui/material';

import { Close, Search } from '@mui/icons-material';

import filter_category from '/public/filter/category.svg';
import filter_service from '/public/filter/service.svg';
import filter_situation from '/public/filter/situation.svg';

import DefaultLayout from 'src/components/Layout/DefaultLayout';
import { ContentsLayer } from 'src/components/CustomLayer';
import { Card, ReferenceCard } from 'src/components/Contents/Card';
import { UITextData, UIRefTextData } from 'src/components/Contents/UITextData';
import Dialog from 'src/components/Dialog';
import SelectFilter from 'src/components/SelectFilter';

import { getUnixToYYYYMMDD } from 'src/utils/simpleDate';

const SearchBox = styled(Paper)({
	height: '240px',
	display: 'flex',
	justifyContent: 'center',
});

const SearchTextField = styled(TextField)({
	'& .MuiOutlinedInput-root': {
		height: '80px',
	},
	maxWidth: '580px',
	height: '80px',
	marginTop: '60px',
});

const FilterIcon = styled(Image)(({ theme }) => {
	const filter = theme.palette.mode === 'dark' ? 'invert(1)' : undefined;
	return {
		color: theme.palette.grey[400],
		filter,
	};
});

const ViewImage = styled(Paper)({
	width: '270px',
	height: '586px',
	borderRadius: '8px',
});

const ViewHeaderChip = styled(({ ...props }: ChipProps) => (
	<Chip {...props} className={props.className + ' ctt_text_14 ctt_bold'} />
))(({ theme }) => {
	return {
		color: theme.palette.grey[200],
	};
});

const ViewRegiDate = styled('p')(({ theme }) => {
	return {
		color: theme.palette.grey[300],
	};
});

const ViewDetail = styled(Stack)({
	width: '488px',
});

// const ViewReferenceText = styled(({ ...props }: TypographyProps) => (
// 	<Typography {...props} className={props.className + ' ctt_text_16 ctt_bold'} />
// ))(({ theme }) => {
// 	return {
// 		color: theme.palette.grey[300],
// 		marginTop: '8px',
// 		marginBottom: '16px',
// 	};
// });

const getData = async (id: number) => {
	const res = await fetch(`/api/ui-datas/${id}`);
	const data = await res.json();
	return data;
};

const Home: TNextPageWithLayout = () => {
	const [contents, setContents] = useState<IUIDatas>({ datas: [] });
	const [viewContent, setViewContent] = useState<IUITextData | undefined>();
	const [tags, setTags] = useState<IUITagCoponents>({
		categorys: [],
		services: [],
		events: [],
	});

	const [tag, setTag] = useState('');
	const [open, setOpen] = useState(false);
	const [checked, setChecked] = useState(false);

	useEffect(() => {
		const fetchUITags = async () => {
			const res = await fetch('/api/ui-tags');
			const tagsData = await res.json();

			setTags(tagsData);
		};
		fetchUITags();

		const fetchUIData = async () => {
			const res = await fetch('/api/ui-datas');
			setContents({ ...contents, datas: await res.json() });
			setChecked(true);
		};
		fetchUIData();
	}, []);

	const handleDialogClose = () => {
		setOpen(false);
	};

	const handleDialogOpen = () => {
		setOpen(true);
	};

	return (
		<Fragment>
			<Box>
				{/* Search Box */}
				<SearchBox elevation={0}>
					<SearchTextField
						fullWidth
						placeholder="서비스, 상황을 검색해보세요"
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<Search />
								</InputAdornment>
							),
						}}
					/>
				</SearchBox>
				{/* Contents Box */}
				<ContentsLayer>
					{/* Search Result */}
					{/* <Box>Search Result</Box> */}
					{/* Filters */}
					<Box sx={{ margin: '48px 0' }}>
						<Stack direction="row" spacing={2}>
							<SelectFilter
								id="AppCategoryFilter"
								options={tags.categorys}
								inputValue={tag}
								label="앱 카테고리"
								onInputChange={(event, newInputValue) => {
									setTag(newInputValue);
								}}
								StartIcon={
									<FilterIcon alt="App Category Filter" {...filter_category} />
								}
							/>
							<SelectFilter
								id="AppCategoryFilter"
								options={tags.services}
								inputValue={tag}
								label="서비스 명"
								onInputChange={(event, newInputValue) => {
									setTag(newInputValue);
								}}
								StartIcon={
									<FilterIcon alt="Service Name Filter" {...filter_service} />
								}
							/>
							<SelectFilter
								id="AppCategoryFilter"
								options={tags.events}
								inputValue={tag}
								label="상황"
								onInputChange={(event, newInputValue) => {
									setTag(newInputValue);
								}}
								StartIcon={
									<FilterIcon alt="Situation Filter" {...filter_situation} />
								}
							/>
						</Stack>
					</Box>
					{/* Display Current Filters */}
					{/* <Box>Display Filter</Box> */}
					{/* Contents */}
					<Box sx={{ margin: '56px 0' }}>
						<Grid container spacing={2}>
							{contents.datas.map((item, idx) => {
								return (
									// 나중에 검색시 기본적으로 Grow Transition을 사용하여 Rendering 하도록 변경하자.
									<Grow
										key={item.id}
										in={checked}
										style={{ transformOrigin: '0 0 0' }}
										{...(checked ? { timeout: 200 + (idx / 3) * 450 } : {})}
									>
										<Grid item xs={12} sm={6} md={4}>
											<Card
												sx={{
													padding: '32px',
													height: '100%',
													cursor: 'pointer',
												}}
												onClick={async () => {
													const contentsData = await getData(item.id);
													setViewContent(contentsData);
													handleDialogOpen();
												}}
											>
												<UITextData item={item} />
											</Card>
										</Grid>
									</Grow>
								);
							})}
						</Grid>
					</Box>
				</ContentsLayer>
			</Box>
			{/* Detail Dialog */}
			<Dialog open={open} onClose={handleDialogClose}>
				{/* Display Contents Detail */}
				{/* Close Button */}
				<IconButton
					aria-label="close"
					onClick={handleDialogClose}
					sx={{
						position: 'absolute',
						right: 6,
						top: 6,
						color: (theme) => theme.palette.grey[400],
					}}
				>
					<Close fontSize="large" />
				</IconButton>
				{viewContent === undefined ? (
					'NO DATA'
				) : (
					<Stack direction="row" spacing={4}>
						{/* Image Box */}
						<ViewImage elevation={0}>image</ViewImage>
						{/* Detail Box */}
						<ViewDetail spacing={3}>
							{/* Header */}
							<Stack alignItems="center" direction="row" spacing={1}>
								{/* Service Icon */}
								{viewContent.tags?.service.icon || (
									<Avatar sx={{ width: 28, height: 28 }}> -</Avatar>
								)}
								{/* Service Name */}
								<ViewHeaderChip label={viewContent.tags?.service.name} />
								<div>
									<Divider sx={{ height: 10 }} orientation="vertical" flexItem />
								</div>
								{/* Event Tags*/}
								{viewContent.tags?.events.map((event) => {
									const react_event_key = `${viewContent.id}-${event.id}`;
									return (
										<ViewHeaderChip
											label={`#${event.name}`}
											key={react_event_key}
										/>
									);
								})}
								<div>
									<Divider sx={{ height: 10 }} orientation="vertical" flexItem />
								</div>
								{/* Registration Date */}
								<ViewRegiDate className="ctt_text_14 ctt_regular">
									{getUnixToYYYYMMDD(viewContent.timestamp)}
								</ViewRegiDate>
							</Stack>
							{/* Text */}
							<Card
								sx={{
									padding: '24px',
									minHeight: '200px',
								}}
							>
								<UITextData item={viewContent} onHeader={false} />
							</Card>
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
						</ViewDetail>
					</Stack>
				)}
			</Dialog>
		</Fragment>
	);
};

Home.PageLayout = DefaultLayout;

export default Home;
