import type { TNextPageWithLayout, IUITagComponents } from 'src/types/components';
import type { IUITextData } from 'src/types/ui-data';

import { useEffect, useState, useCallback, Fragment } from 'react';
import Image from 'next/image';
import { styled } from '@mui/material/styles';
import {
	Box,
	Stack,
	TextField,
	TextFieldProps,
	OutlinedInputProps,
	InputAdornment,
	Button,
} from '@mui/material';
import { Search } from '@mui/icons-material';

import { getUnixToYYYYMMDD } from 'src/utils/simpleDate';

import AdminLayout from 'src/components/Layout/AdminLayout';

import { AntTabs, AntTab, TabContents } from 'src/components/Tab';

import { Writing } from 'src/components/Contents/Writing';
import SelectFilter from 'src/components/SelectFilter';
import SelectedTags from 'src/components/Tag/SelectedTags';
import { TagChip } from 'src/components/Tag/TagChip';
import DataTable from 'src/components/DataTable';
import UIDialogViewer from 'src/components/Contents/UIDialogViewer';

import filter_category from '/public/filter/category.svg';
import filter_service from '/public/filter/service.svg';
import filter_situation from '/public/filter/situation.svg';

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

const imageUpload = async (file: File, service: string) => {
	if (file === undefined) {
		return [];
	}

	const imageData = new FormData();
	const blob = file.slice(0, file.size, file.type);

	const copyFile = new File([blob], encodeURIComponent(`${service}/${file.name}`), {
		type: file.type,
	});

	imageData.append('file', copyFile);

	return await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/file-upload`, {
		method: 'POST',
		credentials: 'include',
		body: imageData,
	})
		.then((rs) => rs.json())
		.catch((err) => {
			console.log(err);
			return [];
		});
};

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

const ContentsBox = styled(Box)({
	backgroundColor: '#fcfcfc',
	padding: '10px',
});

const ButtonBox = styled(Box)({
	textAlign: 'right',
});

const FilterIcon = styled(Image)(({ theme }) => {
	const filter = theme.palette.mode === 'dark' ? 'invert(1)' : undefined;
	return {
		color: theme.palette.grey[400],
		filter,
	};
});

const SearchTextField = styled(({ ...props }: TextFieldProps) => (
	<TextField {...props} className={props.className + ' ctt_text_14 ctt_medium'} />
))(({ theme }) => {
	return {
		marginBottom: '10px',
		width: '300px',
		zIndex: 1,
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
		'& .MuiInputAdornment-root': {
			color: theme.palette.grey[200],
		},
		input: {
			'&::placeholder': {
				color: theme.palette.grey[300],
				opacity: 1,
			},
		},
	};
});

const LEFT_ALIGN = 'left' as const;
const UIDataTableHeader = [
	{ key: 'category', name: 'Category', width: '130px' },
	{ key: 'service', name: 'Service', width: '130px' },
	{ key: 'events', name: 'Events', width: '220px', align: LEFT_ALIGN },
	{ key: 'text', name: 'Text', align: LEFT_ALIGN },
	{ key: 'image', name: 'Image', align: LEFT_ALIGN, width: '220px' },
	{ key: 'copyCount', name: 'Copy', width: '80px' },
	{ key: 'timestamp', name: 'Created', width: '110px' },
];

const TagChipMargin = '0 2px 0 0';

const UIDataList = () => {
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

	const [UIDatas, setUIDatas] = useState([]);

	const [newData, setNewData] = useState<IUITextData>({});

	const [tagQuery, setTagQuery] = useState('');

	const [search, setSearch] = useState<{
		current: string;
		request: string;
		noResult: boolean;
	}>({
		current: '',
		request: '',
		noResult: false,
	});

	const [dialog, setDialog] = useState({
		mode: 'add',
		open: false,
	});

	const handleDialogClose = () => {
		setDialog((prev) => {
			return {
				...prev,
				open: false,
			};
		});
	};
	const handleNewDialogOpen = () => {
		setDialog({
			mode: 'add',
			open: true,
		});
	};

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

	useEffect(() => {
		const fetchUITags = async () => {
			const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ui/tags`);
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
			const res = await getTextUIDatas(getQueryString(page.cur, search.request, tagQuery));
			const result = res.datas.map((item: IUITextData) => {
				return {
					...item,
					timestamp: getUnixToYYYYMMDD(item.timestamp),
					category: (
						<TagChip
							size="small"
							type="category"
							margin={TagChipMargin}
							value={item.tags?.category?.id}
							label={item.tags?.category?.name}
						/>
					),
					service: (
						<TagChip
							size="small"
							type="service"
							margin={TagChipMargin}
							value={item.tags?.service?.id}
							label={item.tags?.service?.name}
						/>
					),
					events: (
						<Fragment>
							{item.tags?.events?.map((tag) => {
								return (
									<TagChip
										key={tag.id}
										size="small"
										type="events"
										margin={TagChipMargin}
										value={tag.id}
										label={tag.name}
									/>
								);
							})}
						</Fragment>
					),
				};
			});

			if (res.totalPage !== page.totalPage) {
				setPage((prev) => {
					return {
						...prev,
						totalPage: res.totalPage,
						totalCount: res.totalCount,
					};
				});
			}

			setUIDatas(result);
			setSearch({ ...search, noResult: result.length === 0 });
		};

		if (page.cur !== 0) {
			fetchUIData();
		}
	}, [page.cur, tagQuery, search.request]);

	return (
		<Fragment>
			<ContentsBox>
				<ButtonBox>
					<Button variant="contained" onClick={handleNewDialogOpen}>
						데이터 추가
					</Button>
				</ButtonBox>

				{/* Filter */}
				<Writing size="14px" color="#828282" mb={4}>
					filter.
				</Writing>
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

								setUIDatas([]);

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
					placeholder="서비스, 상황을 검색해보세요"
					InputLabelProps={{
						className: 'ctt_text_14 ctt_medium',
						shrink: false,
					}}
					InputProps={
						{
							className: 'ctt_text_14 ctt_medium',
							startAdornment: (
								<InputAdornment position="start">
									<Search />
								</InputAdornment>
							),
						} as Partial<OutlinedInputProps>
					}
				/>
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
						StartIcon={<FilterIcon alt="App Category Filter" {...filter_category} />}
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
							handleSetTag(event.currentTarget.getAttribute('value'), 'events', true)
						}
						StartIcon={<FilterIcon alt="Situation Filter" {...filter_situation} />}
					/>
				</Stack>
				{/* Display Current Filters */}
				<Box>
					<SelectedTags
						size="small"
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
				{/* Filter */}
				<Writing size="14px" color="#828282" mt={16} mb={8}>
					data.
				</Writing>
				<DataTable
					headers={UIDataTableHeader}
					rows={UIDatas}
					page={page.cur}
					changePage={(page) => {
						setPage((prev) => {
							if (prev.cur !== page) {
								return {
									...prev,
									cur: page,
								};
							}
							return prev;
						});
					}}
					totalCount={page.totalCount}
				/>
			</ContentsBox>

			{/* Add UI Data Diaolog */}
			<UIDialogViewer
				open={dialog.open}
				write={true}
				data={newData}
				setData={setNewData}
				tags={tags}
				onClose={handleDialogClose}
				BottomComponent={
					<Stack
						direction="row"
						alignItems="center"
						justifyContent="flex-end"
						spacing={1}
					>
						<Button
							variant="contained"
							onClick={() => {
								setNewData({ text: '' });
							}}
						>
							초기화
						</Button>
						<Button
							variant="contained"
							onClick={async (e) => {
								e.preventDefault();

								const data = {
									image: newData.image,
									text: newData.text,
									tags: newData.tags,
								};

								const rs = await fetch(
									`${process.env.NEXT_PUBLIC_API_URL}/ui/datas`,
									{
										method: 'POST',
										credentials: 'include',
										headers: {
											'Content-Type': 'application/json',
										},
										body: JSON.stringify({ datas: [data] }),
									}
								)
									.then((rs) => rs.json())
									.catch((err) => {
										console.log(err);
									});

								const result = rs[0];

								if (result.validation !== true) {
									alert('Validation Faild: ' + result.validation);
									return;
								}

								if (result.image === 'exists') {
									alert('Image already exists.');
									return;
								}

								if (result.create === true) {
									if (!!newData.File && !!newData?.tags?.service?.name) {
										const upload_rs = await imageUpload(
											newData.File,
											newData.tags.service.name
										);

										if (upload_rs?.length === 0) {
											alert(
												'데이터 생성은 성공하였으나, 이미지 업로드를 실패하였습니다.\n관리자에게 문의하세요.'
											);
										} else {
											setNewData({ text: '' });
										}
									}
								} else {
									alert('데이터 생성에 실패하였습니다.\n관리자에게 문의하세요.');
									return;
								}
							}}
						>
							추가하기
						</Button>
					</Stack>
				}
			/>
		</Fragment>
	);
};

const UIDatas: TNextPageWithLayout = () => {
	const [tab, setTab] = useState(0);

	const handleChange = (event: React.SyntheticEvent, index: number) => {
		setTab(index);
	};

	return (
		<Box>
			<AntTabs value={tab} onChange={handleChange} aria-label="tabs">
				<AntTab label="List" />
				<AntTab label="Batch" />
			</AntTabs>
			<TabContents value={tab} index={0}>
				<UIDataList />
			</TabContents>
			<TabContents value={tab} index={1}>
				Test2
			</TabContents>
		</Box>
	);
};

UIDatas.PageLayout = AdminLayout;

export default UIDatas;
