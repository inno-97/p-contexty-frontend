import type { FC } from 'react';
import type { ISelectedTags } from 'src/types/components';

import { Fragment } from 'react';
import { styled } from '@mui/material/styles';

import { Box, Stack, Button, ButtonProps, Divider, DividerProps } from '@mui/material';
import { Refresh } from '@mui/icons-material';

import TagChip from 'src/components/Tag/TagChip';

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

const TagsDivider = styled(({ ...props }: DividerProps) => (
	<Divider {...props} orientation="vertical" flexItem />
))({
	height: 16,
	display: 'inline-block',
	marginRight: '8px',
	verticalAlign: 'middle',
});

const TagChipMargin = '0 8px 0 0';

const SelectedTags: FC<ISelectedTags> = ({ size = 'medium', tags, clearEvent }) => {
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
								type="category"
								value={tag.id}
								label={tag.label}
								margin={TagChipMargin}
								size={size}
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
								type="service"
								value={tag.id}
								label={tag.label}
								margin={TagChipMargin}
								size={size}
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
							size={size}
							type="events"
							value={tag.id}
							label={tag.label}
							margin={TagChipMargin}
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

export default SelectedTags;
