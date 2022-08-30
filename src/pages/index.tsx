import type { TypographyProps, ChipProps, ButtonProps, DividerProps } from '@mui/material';
import type { TNextPageWithLayout, IUITagComponents, IUITagsItem } from 'src/types/components';
import type { IUIDatas, IUITextData } from 'src/types/ui-data';

import { useState, useCallback, useEffect, Fragment } from 'react';
import useInfiniteScroll from 'src/hooks/useInfiniteScroll';
import Image from 'next/image';
import { styled } from '@mui/material/styles';
import {
	Box,
	Grid,
	Paper,
	Stack,
	TextField,
	Button,
	IconButton,
	InputAdornment,
	Typography,
	Divider,
	Avatar,
	Chip,
	Grow,
	CircularProgress,
} from '@mui/material';

import { Close, Search, Refresh } from '@mui/icons-material';

import BannerCharacter from '/public/characters/banner.png';
import NoResultCharacter from '/public/characters/noResult.png';
import filter_category from '/public/filter/category.svg';
import filter_service from '/public/filter/service.svg';
import filter_situation from '/public/filter/situation.svg';

import DefaultLayout from 'src/components/Layout/DefaultLayout';
import { ContentsLayer } from 'src/components/CustomLayer';
import { Card, ReferenceCard } from 'src/components/Contents/Card';
import { UITextData, UIRefTextData } from 'src/components/Contents/UITextData';
import { Writing } from 'src/components/Contents/Writing';
import Dialog from 'src/components/Dialog';
import SelectFilter from 'src/components/SelectFilter';

import { getUnixToYYYYMMDD } from 'src/utils/simpleDate';

const SearchBox = styled(Paper)({
	height: '240px',
	display: 'flex',
	justifyContent: 'center',
	flexDirection: 'column',
	alignItems: 'center',
	backgroundColor: '#EFEAE3',
});

const SearchTextField = styled(TextField)(({ theme }) => {
	return {
		zIndex: 1,
		'& .MuiOutlinedInput-root': {
			height: '72px',
			backgroundColor: '#ffffff',
			border: 'none',
			borderRadius: '16px',
			paddingLeft: '27px',
			paddingRight: '27px',
		},
		'& .MuiInputAdornment-root': {
			color: theme.palette.grey[200],
		},
		fieldset: {
			border: 'none',
		},
		input: {
			'&::placeholder': {
				fontWeight: 600,
				color: theme.palette.grey[200],
				opacity: 1,
			},
		},
	};
});

const SearchResultBox = styled(Box)(({ theme }) => {
	return {
		color: theme.palette.grey[300],
		margin: '32px 0',
	};
});

const SearchResultText = styled(Typography)(({ theme }) => {
	return {
		display: 'inline-block',
		fontWeight: '700',
		color: theme.palette.grey[400],
	};
});

const FilterIcon = styled(Image)(({ theme }) => {
	const filter = theme.palette.mode === 'dark' ? 'invert(1)' : undefined;
	return {
		color: theme.palette.grey[400],
		filter,
	};
});

const FilterClearButton = styled(({ ...props }: ButtonProps) => (
	<Button
		{...props}
		endIcon={<Refresh />}
		className={props.className + ' ctt_text_14 ctt_medium'}
	/>
))(({ theme }) => {
	return {
		color: theme.palette.grey[300],
		padding: '6px 2px',
		'& .MuiButton-endIcon': {
			marginLeft: '4.67px',
			marginRight: '4.67px',
		},
	};
});

const TagChip = styled(({ ...props }: ChipProps) => (
	<Chip
		{...props}
		// size="small"
		className={props.className + ' ctt_text_14 ctt_bold'}
		deleteIcon={<Close />}
	/>
))({
	marginRight: '8px',
	padding: '8px 16px',
	height: 'auto',
	borderRadius: '100px',
	'& .MuiSvgIcon-root': {
		fontSize: '16px',
		color: 'inherit',
		margin: '4px 0',
	},
	'& .MuiChip-label': {
		padding: 0,
		paddingRight: '8px',
	},
});

const TagsDivider = styled(({ ...props }: DividerProps) => (
	<Divider {...props} orientation="vertical" flexItem />
))({
	height: 16,
	display: 'inline-block',
	marginRight: '8px',
	verticalAlign: 'middle',
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

const SelectedTags = (tags: IUITagComponents, clearEvent: (idx: 'all' | IUITagsItem) => void) => {
	const selCategorys = tags.categorys.filter((item) => item.selected === true);
	const selServices = tags.services.filter((item) => item.selected === true);
	const selEvents = tags.events.filter((item) => item.selected === true);

	if (selCategorys.length + selServices.length + selEvents.length === 0) {
		return null;
	}

	return (
		<Stack direction={{ xs: 'column', sm: 'row' }} alignItems="baseline" spacing={2}>
			<FilterClearButton
				onClick={(e) => {
					e.preventDefault();
					e.stopPropagation();

					clearEvent('all');
				}}
			>
				초기화
			</FilterClearButton>
			<Box lineHeight={3} maxWidth="1146px">
				{/* categores */}
				{selCategorys.map((tag, idx) => {
					return (
						<Fragment key={tag.id}>
							<TagChip
								sx={{
									backgroundColor: '#ECF6FE',
									color: '#2196F3',
								}}
								label={tag.label}
								onDelete={(e) => {
									e.preventDefault();
									e.stopPropagation();

									clearEvent(tag);
								}}
							/>
							{selCategorys.length - 1 === idx &&
								selServices.length + selEvents.length !== 0 && <TagsDivider />}
						</Fragment>
					);
				})}

				{/* services */}
				{selServices.map((tag, idx) => {
					return (
						<Fragment key={tag.id}>
							<TagChip
								sx={{
									backgroundColor: '#E6F9EA',
									color: '#3BD569',
								}}
								label={tag.label}
								onDelete={(e) => {
									e.preventDefault();
									e.stopPropagation();

									clearEvent(tag);
								}}
							/>
							{selServices.length - 1 === idx && selEvents.length !== 0 && (
								// <div>
								<TagsDivider />
								// </div>
							)}
						</Fragment>
					);
				})}

				{/* events */}
				{selEvents.map((tag) => {
					return (
						<TagChip
							key={tag.id}
							sx={{
								backgroundColor: '#FEF3E0',
								color: '#FB9600',
							}}
							label={tag.label}
							onDelete={(e) => {
								e.preventDefault();
								e.stopPropagation();

								clearEvent(tag);
							}}
						/>
					);
				})}
			</Box>
		</Stack>
	);
};

const getQueryString = (page: number | null, word: string | null) => {
	const query = [];

	if (typeof page === 'number') {
		query.push(`p=${page}`);
	}

	if (typeof word === 'string' && word !== '') {
		query.push(`q=${word}`);
	}

	return query.join('&');
};

const getData = async (id: number) => {
	const res = await fetch(`/api/ui-datas/${id}`);
	const data = await res.json();
	return data;
};

const getTextUIDatas = async (q: string | null = null) => {
	try {
		const res = await fetch('/api/ui-datas' + (q === null ? '' : '?' + q)).then((data) =>
			data.json()
		);

		return res;
	} catch (e) {
		console.error(e);
		return [];
	}
};

const Home: TNextPageWithLayout = () => {
	const [loading, setLoading] = useState(true);
	const [contents, setContents] = useState<IUIDatas>({ datas: [] });
	const [viewContent, setViewContent] = useState<IUITextData | undefined>();

	const [search, setSearch] = useState<{
		current: string;
		request: string;
		noResult: boolean;
	}>({
		current: '',
		request: '',
		noResult: false,
	});
	const [tags, setTags] = useState<IUITagComponents>({
		categorys: [],
		services: [],
		events: [],
	});

	const [page, setPage] = useState({
		cur: 0,
		total: 1,
	});

	const handleClearTags = useCallback(() => {
		setTags((preTags) => {
			return {
				categorys: preTags.categorys.map((item) => {
					if (item.selected === true) {
						item.selected = false;
					}
					return item;
				}),
				services: preTags.services.map((item) => {
					if (item.selected === true) {
						item.selected = false;
					}
					return item;
				}),
				events: preTags.events.map((item) => {
					if (item.selected === true) {
						item.selected = false;
					}
					return item;
				}),
			};
		});
	}, []);

	const handleIntersect = useCallback(() => {
		if (loading === false) {
			setPage((prev) => {
				if (prev.total > prev.cur) {
					return {
						...prev,
						cur: prev.cur + 1,
					};
				}
				return prev;
			});
		}
	}, [loading]);

	const [setTarget] = useInfiniteScroll(handleIntersect, {
		threshold: 1,
	});

	const [open, setOpen] = useState(false);
	const [checked, setChecked] = useState(false);

	const handleDialogClose = () => {
		setOpen(false);
	};

	const handleDialogOpen = () => {
		setOpen(true);
	};

	useEffect(() => {
		const fetchUITags = async () => {
			const res = await fetch('/api/ui-tags');
			const tagsData = await res.json();

			setTags(tagsData);
		};
		fetchUITags();

		setPage((prev) => {
			return {
				...prev,
				cur: 1,
			};
		});
	}, []);

	useEffect(() => {
		const fetchUIData = async () => {
			const res = await getTextUIDatas(getQueryString(page.cur, search.request));
			const datas: IUITextData[] = res.datas;

			if (res.totalPage !== page.total) {
				setPage((prev) => {
					return {
						...prev,
						total: res.totalPage,
					};
				});
			}

			setLoading(false);

			if (datas.length !== 0) {
				setContents((prev) => {
					return { ...prev, datas: [...prev.datas, ...datas] };
				});
			}

			setSearch({ ...search, noResult: datas.length === 0 });
			if (res.length !== 0) {
				setChecked(true);
			}
		};

		if (page.cur !== 0) {
			setLoading(true);
			fetchUIData();
		}
	}, [search.request, page.cur]);

	return (
		<Fragment>
			<Box>
				{/* Search Box */}
				<SearchBox elevation={0}>
					<Box position="absolute" width={580} textAlign="center">
						<Box display="inline-block" position="relative" width={269} height={196}>
							<Box
								display="inline-block"
								width={196}
								height={196}
								zIndex={1}
								position="absolute"
								left="-43px"
							>
								<Image alt="Banner Character" {...BannerCharacter} />
							</Box>
							<Typography
								sx={{
									position: 'absolute',
									right: 0,
									top: '18px',
									borderRadius: '16px',
									width: '166px',
									display: 'inline-block',
									backgroundColor: '#DDD7CF',
									color: '#928A7F',
									padding: '16px 20px',
									fontWeight: 600,
									fontSize: '20px',
									lineHeight: '24px',
									letterSpacing: '-1px',
									zIndex: 0,
								}}
							>
								흠...뭐라고 쓰지?
							</Typography>
						</Box>
					</Box>
					<Box width={580} textAlign="center" mt="80px">
						<SearchTextField
							value={search.current}
							onKeyDown={(e) => {
								if (e.key === 'Enter') {
									setSearch({
										...search,
										request: search.current,
									});
								}
							}}
							onChange={(e) => {
								setSearch({
									...search,
									current: e.target.value,
								});
							}}
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
					</Box>
				</SearchBox>
				{/* Contents Box */}
				<ContentsLayer>
					{/* Search Result */}
					<Box height="48px">
						{search.request && (
							<SearchResultBox className="ctt_text_16 ctt_regular">
								<SearchResultText>{search.request}</SearchResultText> 검색 결과{' '}
								<SearchResultText>{contents.datas.length}</SearchResultText>건
							</SearchResultBox>
						)}
					</Box>
					{/* Filters */}
					<Box>
						<Stack direction="row" spacing={2}>
							{/* SelectBox UI TAG */}
							<SelectFilter
								id="AppCategoryFilter"
								disabled={search.noResult}
								options={tags.categorys.filter((tag) => tag.selected !== true)}
								label="앱 카테고리"
								onOptionClick={(event) => {
									const targetValue: string | null =
										event.currentTarget.getAttribute('value') || null;

									if (
										typeof targetValue === 'string' &&
										!Number.isNaN(targetValue)
									) {
										const tagId = parseInt(targetValue);

										setTags((preTags) => {
											const newTags = preTags.categorys.map((item) => {
												if (item.id === tagId) {
													return {
														...item,
														selected: true,
													};
												}
												return item;
											});

											return {
												...preTags,
												categorys: newTags,
											};
										});
									}
								}}
								StartIcon={
									<FilterIcon alt="App Category Filter" {...filter_category} />
								}
							/>
							<SelectFilter
								id="AppCategoryFilter"
								disabled={search.noResult}
								options={tags.services.filter(
									(tag) => tag.selected === undefined || tag.selected === false
								)}
								label="서비스 명"
								onOptionClick={(event) => {
									const targetValue: string | null =
										event.currentTarget.getAttribute('value') || null;

									if (
										typeof targetValue === 'string' &&
										!Number.isNaN(targetValue)
									) {
										const tagId = parseInt(targetValue);

										setTags((preTags) => {
											const newTags = preTags.services.map((item) => {
												if (item.id === tagId) {
													return {
														...item,
														selected: true,
													};
												}
												return item;
											});

											return {
												...preTags,
												services: newTags,
											};
										});
									}
								}}
								StartIcon={
									<FilterIcon alt="Service Name Filter" {...filter_service} />
								}
							/>
							<SelectFilter
								id="AppCategoryFilter"
								disabled={search.noResult}
								options={tags.events.filter(
									(tag) => tag.selected === undefined || tag.selected === false
								)}
								label="상황"
								onOptionClick={(event) => {
									const targetValue: string | null =
										event.currentTarget.getAttribute('value') || null;

									if (
										typeof targetValue === 'string' &&
										!Number.isNaN(targetValue)
									) {
										const tagId = parseInt(targetValue);

										setTags((preTags) => {
											const newTags = preTags.events.map((item) => {
												if (item.id === tagId) {
													return {
														...item,
														selected: true,
													};
												}
												return item;
											});

											return {
												...preTags,
												events: newTags,
											};
										});
									}
								}}
								StartIcon={
									<FilterIcon alt="Situation Filter" {...filter_situation} />
								}
							/>
						</Stack>
					</Box>
					{/* Display Current Filters */}
					<Box marginTop="24px">
						{SelectedTags(tags, (target) => {
							if (target === 'all') {
								handleClearTags();
							} else {
								const tagType: string = target.type + 's';

								setTags((preTags) => {
									const newTags = preTags[tagType].map((item) => {
										if (item.id === target.id) {
											return {
												...item,
												selected: false,
											};
										}
										return item;
									});

									return {
										...preTags,
										[tagType]: newTags,
									};
								});
							}
						})}
					</Box>
					{/* Contents */}
					<Box margin="56px 0" minHeight={430}>
						{(search.noResult && !loading && (
							<Box textAlign="center">
								<Image
									alt="noReulst Character"
									{...NoResultCharacter}
									width={210}
									height={170}
								/>
								<Writing className="ctt_text_16 ctt_medium" mb={120}>
									따혹, 검색 결과가 없어요! <br />
									다른 키워드로 검색해 보세요.
								</Writing>
							</Box>
						)) || (
							<Grid container spacing={2}>
								{contents.datas.map((item, idx) => {
									return (
										// 나중에 검색시 기본적으로 Grow Transition을 사용하여 Rendering 하도록 변경하자.
										<Grow
											key={item.id}
											in={checked}
											style={{ transformOrigin: '0 0 0' }}
											{...(checked && page.cur === 1
												? { timeout: 200 + (idx / 3) * 250 }
												: {})}
										>
											<Grid
												item
												xs={12}
												sm={6}
												md={4}
												ref={
													contents.datas.length - 1 === idx
														? setTarget
														: null
												}
											>
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
						)}
						<Box textAlign="center" mt={2} display={loading ? 'block' : 'none'}>
							<CircularProgress size={100} thickness={7} sx={{ color: '#F1F3F5' }} />
						</Box>
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
								<UITextData item={viewContent} onTags={false} />
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
