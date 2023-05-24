import type { TNextPageWithLayout, IUITagComponents } from 'src/types/components';
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
	InputAdornment,
	Typography,
	Grow,
	CircularProgress,
} from '@mui/material';

import { Search } from '@mui/icons-material';

import UITagsAPI from 'src/apis/ui-tags';

import BannerCharacter from '/public/characters/banner.png';
import NoResultCharacter from '/public/characters/noResult.png';
import filter_category from '/public/filter/category.svg';
import filter_service from '/public/filter/service.svg';
import filter_situation from '/public/filter/situation.svg';

import DefaultLayout from 'src/components/Layout/DefaultLayout';
import { ContentsLayer } from 'src/components/CustomLayer';
import { Card } from 'src/components/Contents/Card';
import UIDialogViewer from 'src/components/Contents/UIDialogViewer';
import { UITextData } from 'src/components/Contents/UITextData';
import { Writing } from 'src/components/Contents/Writing';
import SelectFilter from 'src/components/SelectFilter';
import SelectedTags from 'src/components/Tag/SelectedTags';

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

const getQueryString = (page: number | null, word: string | null, tags: string | null) => {
	const query = [];

	if (typeof page === 'number') {
		query.push(`p=${page}`);
	}

	if (typeof word === 'string' && word !== '') {
		query.push(`q=${word}`);
	}

	if (typeof tags === 'string' && tags !== '') {
		query.push(`t=${tags.slice(0, -1)}`);
	}

	return query.join('&');
};

const getData = async (id: number | null = null) => {
	if (id === null) {
		throw 'getData ID is Null';
	}
	const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ui/datas/${id}`);
	const data = await res.json();
	return data;
};

const getTextUIDatas = async (q: string | null = null) => {
	try {
		const res = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/ui/datas${q === null ? '' : '?' + q}`
		).then((data) => data.json());

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

	const [tags, setTags] = useState<IUITagComponents>({
		categorys: [],
		services: [],
		events: [],
	});

	const [page, setPage] = useState({
		cur: 0,
		totalPage: 1,
		totalCount: 0,
	});

	const [search, setSearch] = useState<{
		current: string;
		request: string;
		noResult: boolean;
	}>({
		current: '',
		request: '',
		noResult: false,
	});

	const [tagQuery, setTagQuery] = useState('');

	const handleIntersect = useCallback(() => {
		if (loading === false) {
			setLoading(true);

			setPage((prev) => {
				if (prev.totalPage > prev.cur) {
					return {
						...prev,
						cur: prev.cur + 1,
					};
				}

				setLoading(false);
				return prev;
			});
		}
	}, [loading]);

	const [setTarget] = useInfiniteScroll(handleIntersect, {
		threshold: 1,
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

		setPage({
			cur: 1,
			totalPage: 1,
			totalCount: 0,
		});

		setTagQuery('');
	}, []);

	const handleSetTag = useCallback(
		(target: string | number | null, type: string, selected: boolean) => {
			let tagId = target;

			if (typeof target === 'string' && !Number.isNaN(target)) {
				tagId = parseInt(target);
			}

			if (tagId !== null) {
				setTags((preTags) => {
					const newTags = preTags[type].map((item) => {
						if (item.id === tagId) {
							return {
								...item,
								selected: selected,
							};
						}
						return item;
					});

					return {
						...preTags,
						[type]: newTags,
					};
				});

				setPage({
					cur: 1,
					totalPage: 1,
					totalCount: 0,
				});

				setTagQuery((preQuery) => {
					const t = `${type[0]}:${tagId},`;
					const newQuery = selected ? preQuery + t : preQuery.replace(t, '');
					return newQuery;
				});
			}
		},
		[]
	);

	const handleUITextCopy = useCallback(
		async (id: number, tooltip: (message: string) => void) => {
			// Copy 검증
			const checkCopy = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/copy/ui-data`, {
				method: 'PUT',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					did: id,
					increased: 1,
				}),
			});

			if (checkCopy.status === 200) {
				const result = await checkCopy.json();

				setContents((prev) => {
					const newDatas = prev.datas.map((item) => {
						if (item.id !== id) {
							return item;
						}

						let tooltioMessage = '복사했어요!';

						if (result.first === true) {
							tooltioMessage = '🎉 첫 번째로 복사했어요!';
						} else if (item.copyCount === 0 && result.first === false) {
							tooltioMessage = '아쉽게도 누가 먼저 복사했어요!';
						}

						tooltip(tooltioMessage);

						return {
							...item,
							copied: true,
							copyCount: result.copyCount,
						};
					});

					return {
						...prev,
						datas: newDatas,
					};
				});

				if (viewContent?.id === id) {
					setViewContent((prevView) => {
						if (prevView !== undefined) {
							return {
								...prevView,
								copyCount: result.copyCount,
							};
						}
					});
				}
			}
		},
		[viewContent?.id]
	);

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
			const tagsData = await UITagsAPI.getUITags();
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
			const res = await getTextUIDatas(getQueryString(page.cur, search.request, tagQuery));
			const datas: IUITextData[] = res.datas;

			if (res.totalPage !== page.totalPage) {
				setPage((prev) => {
					return {
						...prev,
						totalPage: res.totalPage,
					};
				});
			}

			// 단어 검색시 검색 건수를 표출
			if (search.request !== '' && page.cur === 1) {
				setPage((prev) => {
					return {
						...prev,
						totalCount: res.totalCount,
					};
				});
			}

			setLoading(false);

			if (page.cur === 1) {
				setContents({ datas: datas });
			} else {
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
	}, [page.cur, tagQuery, search.request]);

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
									if (search.current !== search.request) {
										setSearch({
											...search,
											request: search.current,
											noResult: false,
										});

										handleClearTags();

										setContents({ datas: [] });

										setPage({
											cur: 1,
											totalPage: 1,
											totalCount: 0,
										});
									}
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
								<SearchResultText>{page.totalCount}</SearchResultText>건
							</SearchResultBox>
						)}
					</Box>
					{/* Filters */}
					<Stack direction="row" spacing={2}>
						{/* SelectBox UI TAG */}
						<SelectFilter
							id="AppCategoryFilter"
							disabled={search.noResult}
							options={tags.categorys.filter((tag) => tag.selected !== true)}
							label="앱 카테고리"
							onOptionClick={(event) =>
								handleSetTag(
									event.currentTarget.getAttribute('value'),
									'categorys',
									true
								)
							}
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
							onOptionClick={(event) =>
								handleSetTag(
									event.currentTarget.getAttribute('value'),
									'services',
									true
								)
							}
							StartIcon={<FilterIcon alt="Service Name Filter" {...filter_service} />}
						/>
						<SelectFilter
							id="AppCategoryFilter"
							disabled={search.noResult}
							options={tags.events.filter(
								(tag) => tag.selected === undefined || tag.selected === false
							)}
							label="상황"
							onOptionClick={(event) =>
								handleSetTag(
									event.currentTarget.getAttribute('value'),
									'events',
									true
								)
							}
							StartIcon={<FilterIcon alt="Situation Filter" {...filter_situation} />}
						/>
					</Stack>
					{/* Display Current Filters */}
					<Box marginTop="24px">
						<SelectedTags
							tags={tags}
							clearEvent={(target) => {
								if (target === 'all') {
									handleClearTags();
								} else {
									handleSetTag(target.id, target.type + 's', false);
								}
							}}
						/>
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
														'&:hover': {
															transition: 'all 0.1s linear',
															background: '#F3F5F7',
														},
														'&:active': {
															transition: 'all 0.1s linear',
															background: '#E9ECEF',
														},
													}}
													onClick={async () => {
														const contentsData = await getData(item.id);
														setViewContent(contentsData);
														handleDialogOpen();
													}}
												>
													<UITextData
														item={item}
														handleCopy={handleUITextCopy}
													/>
												</Card>
											</Grid>
										</Grow>
									);
								})}
							</Grid>
						)}
						<Box textAlign="center" mt={2} display={loading ? 'block' : 'none'}>
							<CircularProgress size={48} thickness={7} sx={{ color: '#F1F3F5' }} />
						</Box>
					</Box>
				</ContentsLayer>
			</Box>
			{/* Detail Dialog */}
			<UIDialogViewer
				open={open}
				data={viewContent}
				onClose={handleDialogClose}
				onUITextCopy={handleUITextCopy}
			/>
		</Fragment>
	);
};

Home.PageLayout = DefaultLayout;

export default Home;
