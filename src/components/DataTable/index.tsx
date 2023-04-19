import type { SyntheticEvent } from 'react';
import type { IDataTable } from 'src/types/components';
import { FC, Fragment } from 'react';

import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Pagination,
	Paper,
} from '@mui/material';

const DataTable: FC<IDataTable> = ({
	onRowsPerPage = false,
	rowsPerPageList = [15],
	rowsPerPage = 15,
	onTotalCount = false,
	totalCount = 0,
	page = 0,
	changePage = null,
	onTopPagination = false,
	onBottomPagination = true,
	selecting = false,
	headers = [],
	rowOptions = undefined,
	rows = [],
}) => {
	const pageList = Math.ceil(totalCount / rowsPerPage);
	const columnOption = rowOptions?.column;

	return (
		<Fragment>
			<TableContainer component={Paper}>
				<Table size="small" sx={{ whiteSpace: 'nowrap' }}>
					<TableHead
						sx={{
							height: '52px',
							'& th': { fontWeight: 600 },
						}}
					>
						<TableRow>
							{headers.map((item) => (
								<TableCell
									key={`header-${item.key}`}
									align={item.align || 'center'}
									width={item.width}
								>
									{item.name || item.key}
								</TableCell>
							))}
						</TableRow>
					</TableHead>
					<TableBody>
						{rows.map((row, idx) => (
							<TableRow
								key={`row-${idx}`}
								sx={{
									'&:last-child td, &:last-child th': { border: 0 },
								}}
							>
								{headers.map((item, idx) => {
									let handleOnClick = undefined;
									let style = {};

									if (columnOption?.hasOwnProperty(item.key) === true) {
										const columnEvents = columnOption[item.key].onClick;

										if (columnEvents !== undefined) {
											handleOnClick = (e: SyntheticEvent) => {
												columnEvents(e, row);
											};

											style = {
												cursor: 'pointer',
												color: '#214ccb',
											};
										}
									}

									return (
										<TableCell
											key={`row-${item.key}-${idx}`}
											align={item.align || 'center'}
											onClick={handleOnClick}
											sx={style}
										>
											{row[item.key]}
										</TableCell>
									);
								})}
							</TableRow>
						))}
						{rows.length === 0 && (
							<TableRow>
								<TableCell align="center" colSpan={headers.length}>
									검색 결과가 없습니다.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</TableContainer>

			{/* Pagination */}
			{onBottomPagination && (
				<Pagination
					sx={{
						margin: '8px 0 8px 0',
						'& ul': {
							justifyContent: 'end',
						},
					}}
					count={pageList}
					page={page}
					onChange={(e, page) => {
						e.preventDefault();
						if (changePage !== null) {
							changePage(page);
						}
					}}
					size="small"
					shape="rounded"
					showFirstButton
					showLastButton
				/>
			)}
		</Fragment>
	);
};

export default DataTable;
