import type { SyntheticEvent } from 'react';
import type {
	TNextPageWithLayout,
	TDataTableRow,
	TConfirmDialog,
	IUITagComponents,
} from 'src/types/components';
import type { IUITextData } from 'src/types/ui-data';

import { useState, useCallback, Fragment } from 'react';
import { useQuery } from 'react-query';

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
	DialogTitle,
	DialogContent,
	DialogActions,
} from '@mui/material';
import { Search } from '@mui/icons-material';

import UIDatasAPI from 'src/apis/ui-datas';
import UITagsAPI from 'src/apis/ui-tags';

import { getUnixToYYYYMMDD } from 'src/utils/simpleDate';

import AdminLayout from 'src/components/Layout/AdminLayout';

import { AntTabs, AntTab, TabContents } from 'src/components/Tab';

import { Writing } from 'src/components/Contents/Writing';
import SelectFilter from 'src/components/SelectFilter';
import SelectedTags from 'src/components/Tag/SelectedTags';
import { TagChip } from 'src/components/Tag/TagChip';
import DataTable from 'src/components/DataTable';
import UIDialogViewer from 'src/components/Contents/UIDialogViewer';
import Dialog from 'src/components/Dialog';

import filter_category from '/public/filter/category.svg';
import filter_service from '/public/filter/service.svg';
import filter_situation from '/public/filter/situation.svg';

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
		width: '100%',
		[theme.breakpoints.up('md')]: {
			width: '300px',
		},
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

const FilterStack = styled(Stack)(({ theme }) => {
	return {
		'& > div': {
			[theme.breakpoints.up('md')]: {
				width: '240px',
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

const initializePage = {
	page: 1,
	rowsPerPage: 15,
	totalPage: 0,
	totalCount: 0,
};

const UIDataList = () => {
	const { data: uiTagsQuery } = useQuery(['ui-tags'], UITagsAPI.getUITags, {
		placeholderData: { categorys: [], services: [], events: [] },
		onSuccess: (data) => {
			setTags(data);
		},
	});

	const [tags, setTags] = useState<IUITagComponents>(uiTagsQuery);

	const [search, setSearch] = useState({
		current: '',
		word: '',
		tagQuery: '',
		...initializePage,
		noResult: false,
	});

	const { data: uiDatasQuery = { datas: [] }, refetch: uiDatasRefetch } = useQuery(
		[
			'ui-datas',
			UIDatasAPI.getQueryString(
				search.rowsPerPage,
				search.page,
				search.word,
				search.tagQuery
			),
		],
		({ queryKey }) => {
			return UIDatasAPI.getUIDatas(queryKey[1]);
		},
		{
			onSuccess: (res) => {
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

				setSearch((prev) => {
					const newData = {
						...prev,
						noResult: false,
						totalPage: res.totalPage,
						totalCount: res.totalCount,
					};

					if (result.length === 0) {
						newData.noResult = true;
					}

					return newData;
				});

				setUIDatas(result);
			},
			refetchOnMount: true,
		}
	);
	const [UIDatas, setUIDatas] = useState(uiDatasQuery.datas);

	const [newData, setNewData] = useState<IUITextData>({});
	const [UIData, setUIData] = useState<IUITextData>({});

	const [dialog, setDialog] = useState({
		mode: 'add',
		open: false,
	});

	const [confirm, setConfirm] = useState<TConfirmDialog>({
		open: false,
		content: '',
		eventPrevent: false,
	});

	const handleConfirmClose = () => {
		setConfirm((prev) => {
			return {
				...prev,
				open: false,
				eventPrevent: false,
			};
		});
	};

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

		setSearch((prev) => {
			return {
				...prev,
				...initializePage,
				tagQuery: '',
			};
		});
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

				setSearch((prev) => {
					const t = `${type[0]}:${tagId},`;
					const newQuery = selected ? prev.tagQuery + t : prev.tagQuery.replace(t, '');

					return {
						...prev,
						...initializePage,
						tagQuery: newQuery,
					};
				});
			}
		},
		[]
	);

	const handleUIDataUpdate = async (data: IUITextData) => {
		const rs = await UIDatasAPI.updateUIData(data);

		if (rs.validation !== true) {
			alert('Validation Faild: ' + rs.validation);
			return;
		}

		if (rs.image === 'exists') {
			alert('Image already exists.');
			return;
		}

		if (rs.image === false) {
			alert('이미지 업데이트에 실패하였습니다.\n관리자에게 문의하세요.');
			return;
		}

		if (rs.update === false) {
			alert('데이터 업데이트에 실패하였습니다.\n관리자에게 문의하세요.');
			return;
		}

		uiDatasRefetch();
	};

	const handleUIDataDelete = async (id: number) => {
		const rs = await UIDatasAPI.deleteUIData(id);

		if (rs.delete === false) {
			alert('데이터 삭제를 실패하였습니다.\n관리자에게 문의하세요.');
		}

		if (rs.delete === false) {
			alert('이미지 삭제를 실패하였습니다.\n관리자에게 문의하세요.');
		}

		uiDatasRefetch();
		handleDialogClose();
	};

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
							if (search.current !== search.word) {
								setSearch({
									...search,
									word: search.current,
								});

								handleClearTags();
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
				<FilterStack direction={{ sm: 'column', md: 'row' }} spacing={2}>
					{/* SelectBox UI TAG */}
					<SelectFilter
						id="AppCategoryFilter"
						disabled={search.noResult}
						options={tags.categorys.filter((tag) => tag.selected !== true)}
						label="앱 카테고리"
						onOptionClick={(value) => handleSetTag(value, 'categorys', true)}
						StartIcon={<FilterIcon alt="App Category Filter" {...filter_category} />}
					/>
					<SelectFilter
						id="AppCategoryFilter"
						disabled={search.noResult}
						options={tags.services.filter(
							(tag) => tag.selected === undefined || tag.selected === false
						)}
						label="서비스 명"
						onOptionClick={(value) => handleSetTag(value, 'services', true)}
						StartIcon={<FilterIcon alt="Service Name Filter" {...filter_service} />}
					/>
					<SelectFilter
						id="AppCategoryFilter"
						disabled={search.noResult}
						options={tags.events.filter(
							(tag) => tag.selected === undefined || tag.selected === false
						)}
						label="상황"
						onOptionClick={(value) => handleSetTag(value, 'events', true)}
						StartIcon={<FilterIcon alt="Situation Filter" {...filter_situation} />}
					/>
				</FilterStack>
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
					rowOptions={{
						column: {
							text: {
								onClick: async (e: SyntheticEvent, row: TDataTableRow) => {
									if (typeof row?.id !== 'number') {
										return;
									}

									const data = await UIDatasAPI.getUIdata(row.id);
									setUIData(data);

									setDialog({
										mode: 'edit',
										open: true,
									});
								},
							},
						},
					}}
					rows={UIDatas}
					page={search.page}
					changePage={(page) => {
						setSearch((prev) => {
							if (prev.page !== page) {
								return {
									...prev,
									page: page,
								};
							}
							return prev;
						});
					}}
					totalCount={search.totalCount}
				/>
			</ContentsBox>

			{/* Add UI Data Diaolog */}
			<UIDialogViewer
				open={dialog.open}
				write={true}
				data={dialog.mode === 'add' ? newData : UIData}
				setData={dialog.mode === 'add' ? setNewData : setUIData}
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
							onClick={async () => {
								if (dialog.mode === 'add') {
									setNewData({ text: '' });
								} else {
									const data = await UIDatasAPI.getUIdata(UIData.id);
									setUIData(data);
								}
							}}
						>
							초기화
						</Button>
						{dialog.mode === 'add' ? (
							<Button
								variant="contained"
								onClick={async (e) => {
									e.preventDefault();

									if (newData?.File === undefined) {
										alert('undefined image.');
										return;
									}

									const rs = await UIDatasAPI.createUIData(newData);
									const result = rs[0];

									if (result.validation !== true) {
										alert('Validation Faild: ' + result.validation);
										return;
									}

									if (result.image === 'undefined') {
										alert('Image undefined.');
										return;
									}

									if (result.image === 'exists') {
										alert('Image already exists.');
										return;
									}

									if (result.create === true) {
										setNewData({ text: '' });
									} else {
										alert(
											'데이터 생성에 실패하였습니다.\n관리자에게 문의하세요.'
										);
										return;
									}
								}}
							>
								추가
							</Button>
						) : (
							<Fragment>
								<Button
									variant="contained"
									onClick={() => {
										setConfirm((prev) => {
											return {
												...prev,
												open: true,
												content: '수정하시겠습니까?',
												event: async () => {
													await handleUIDataUpdate(UIData);
													handleConfirmClose();
												},
											};
										});
									}}
								>
									수정
								</Button>
								<Button
									variant="contained"
									onClick={() => {
										setConfirm((prev) => {
											return {
												...prev,
												open: true,
												content: '삭제하시겠습니까?',
												event: async () => {
													if (UIData?.id !== undefined) {
														await handleUIDataDelete(UIData.id);
														handleConfirmClose();
													}
												},
											};
										});
									}}
								>
									삭제
								</Button>
							</Fragment>
						)}
					</Stack>
				}
			/>
			<Dialog open={confirm.open} onClose={handleConfirmClose}>
				<DialogTitle>Confirm</DialogTitle>
				<DialogContent>{confirm.content}</DialogContent>
				<DialogActions>
					<Button onClick={handleConfirmClose}>아니요</Button>
					<Button
						onClick={() => {
							if (
								typeof confirm?.event === 'function' &&
								confirm.eventPrevent === false
							) {
								setConfirm((prev) => {
									return {
										...prev,
										eventPrevent: true,
									};
								});
								confirm.event();
							}
						}}
					>
						예
					</Button>
				</DialogActions>
			</Dialog>
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
