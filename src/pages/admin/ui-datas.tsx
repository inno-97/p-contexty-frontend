import type { TNextPageWithLayout, IUITagComponents, IUITagsItem } from 'src/types/components';
import type { TUITgas, IUITextData } from 'src/types/ui-data';

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
	IconButton,
	Button,
	Avatar,
	Menu,
	MenuItem,
	Divider,
	Fade,
} from '@mui/material';
import { Search, AddPhotoAlternate } from '@mui/icons-material';

import { getUnixToYYYYMMDD } from 'src/utils/simpleDate';

import AdminLayout from 'src/components/Layout/AdminLayout';

import { AntTabs, AntTab, TabContents } from 'src/components/Tab';

import { Writing } from 'src/components/Contents/Writing';
import SelectFilter from 'src/components/SelectFilter';
import SelectedTags from 'src/components/Tag/SelectedTags';
import { TagChip, NormalTagChip } from 'src/components/Tag/TagChip';
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
	// let default_mode = true;

	if (typeof page === 'number') {
		query.push(`p=${page}`);
	}

	if (typeof word === 'string' && word !== '') {
		query.push(`q=${word}`);
		// default_mode = false;
	}

	if (typeof tags === 'string' && tags !== '') {
		query.push(`t=${tags.slice(0, -1)}`);
		// default_mode = false;
	}

	return query.join('&');
};

const ContentsBox = styled(Box)({
	backgroundColor: '#fcfcfc',
	padding: '10px',
});

const ButtonBox = styled(Box)({
	// paddingBottom: '10px',
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
			// border: 'none',
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
// const UIDataTableRowOption = {

// }

const TagChipMargin = '0 2px 0 0';

const UIDataList = () => {
	const [tags, setTags] = useState<IUITagComponents>({
		categorys: [],
		services: [],
		events: [],
	});

	const [page, setPage] = useState({
		cur: 0, // 개발환경에서 맨 처음 useEffect에서 두번씩 조회해서 페이지 첫 로딩시에는 0으로 셋팅
		totalPage: 1,
		totalCount: 0,
	});

	const [contents, setContents] = useState([]);

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

	const [open, setOpen] = useState(false);

	const handleDialogClose = () => {
		setOpen(false);
	};
	const handleDialogOpen = () => {
		setOpen(true);
	};

	const [tagMenu, setTagMenu] = useState<{
		target: null | HTMLElement;
		data: IUITagsItem[];
	}>({
		target: null,
		data: [],
	});

	const handleTagMenuClose = () => {
		setTagMenu((prev) => {
			return {
				...prev,
				target: null,
			};
		});
	};

	const handleTagMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
		setTagMenu({
			target: event.currentTarget,
			data: tags[event.currentTarget.id],
		});
	};

	const handleTagDelete = (id: number) => {
		setNewData((prev) => {
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

	const handleImageChange = (e: React.ChangeEvent) => {
		const targetFiles = (e.target as HTMLInputElement).files as FileList;

		const imageName = targetFiles[0].name;
		const imageSrc = URL.createObjectURL(targetFiles[0]);

		setNewData((prev) => {
			return {
				...prev,
				image: imageName,
				imageSrc: imageSrc,
				File: targetFiles[0],
			};
		});
	};

	const handleTagChange = (tag: IUITagsItem) => {
		setNewData((prev) => {
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

			setContents(result);
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
					<Button variant="contained" onClick={handleDialogOpen}>
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

								setContents([]);

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
					rows={contents}
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
			<UIDialogViewer
				open={open}
				onClose={handleDialogClose}
				ImageComponent={
					<Fragment>
						{newData.imageSrc !== undefined && (
							<span
								style={{
									borderRadius: '8px',
									position: 'absolute',
								}}
							>
								<Image
									alt="Text UI Data Image"
									width="270px"
									height="586px"
									// loader={previewIamgeLoader}
									src={newData?.imageSrc}
								/>
							</span>
						)}
						<IconButton
							sx={{ margin: 'auto', backgroundColor: '#6f6f6f30' }}
							component="label"
						>
							<input
								hidden
								accept="image/*"
								type="file"
								onClick={(e) => {
									if (newData?.tags?.service?.id === undefined) {
										e.preventDefault();
										alert('이미지를 추가하기 전 서비스를 먼저 선택해 주세요.');
									}
								}}
								onChange={handleImageChange}
							/>
							<AddPhotoAlternate fontSize="large" />
						</IconButton>
					</Fragment>
				}
				HeaderComponent={
					<Stack alignItems="center" direction="row" spacing={1}>
						{/* Category Tag */}
						<NormalTagChip
							id="categorys"
							onClick={handleTagMenuOpen}
							label={
								(newData?.tags?.category && newData?.tags?.category.name) || (
									<FilterIcon alt="App Category Filter" {...filter_category} />
								)
							}
						/>

						{/* Service Icon */}
						{/* {newData?.tags?.service.icon || (
							<Avatar sx={{ width: 28, height: 28 }}> -</Avatar>
						)} */}

						{/* Service Tag */}
						<NormalTagChip
							id="services"
							onClick={handleTagMenuOpen}
							label={
								(newData?.tags?.service && newData?.tags?.service.name) || (
									<FilterIcon alt="App Service Filter" {...filter_service} />
								)
							}
						/>
						<div>
							<Divider sx={{ height: 10 }} orientation="vertical" flexItem />
						</div>
						{/* Event Tags*/}
						{newData?.tags?.events?.map((event) => {
							const react_event_key = `new-${event.id}`;
							return (
								<NormalTagChip
									label={`#${event.name}`}
									key={react_event_key}
									onDelete={handleTagDelete.bind(null, event.id)}
								/>
							);
						})}
						<NormalTagChip
							onClick={handleTagMenuOpen}
							id="events"
							label={<FilterIcon alt="App Events Filter" {...filter_situation} />}
						/>
					</Stack>
				}
				TextComponent={
					<TextField
						value={newData?.text}
						fullWidth
						multiline
						minRows={3}
						sx={{
							marginBottom: '38px',
						}}
						placeholder="텍스트를 입력하세요!"
						onChange={(e) => {
							setNewData((prev) => {
								return {
									...prev,
									text: e.target.value,
								};
							});
						}}
					/>
				}
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
						const find = newData?.tags?.events?.findIndex((item) => item.id === tag.id);
						if (find !== undefined && find > -1) {
							selected = true;
						}
					} else if (tag.type === 'category' || tag.type === 'service') {
						const a = newData?.tags;
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
