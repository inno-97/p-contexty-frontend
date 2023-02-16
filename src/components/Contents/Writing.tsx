import type { FC } from 'react';
import type { SystemCssProperties } from '@mui/system';
import type { IWriting, IParagraph, ISentence } from 'src/types/components';

import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

const SentenceElement = styled('p')({});

function makeDefaultStyle(lineSpacing?: number, size?: string, weight?: string, color?: string) {
	const sx: SystemCssProperties = {};

	if (lineSpacing !== undefined) {
		sx.lineHeight = `${lineSpacing}px`;
	}
	if (size !== undefined) {
		sx.fontSize = size;
	}
	if (weight !== undefined) {
		sx.fontWeight = weight;
	}
	if (color !== undefined) {
		sx.color = color;
	}

	return sx;
}

function makeMarginStyle(mt?: number, mb?: number) {
	const sx: SystemCssProperties = {};
	if (mt !== undefined) {
		sx.mt = `${mt}px`;
	}
	if (mb !== undefined) {
		sx.mb = `${mb}px`;
	}

	return sx;
}

export const Writing: FC<IWriting> = ({
	className,
	textAlign,
	lineSpacing,
	color,
	size,
	weight,
	mt,
	mb,
	children,
}) => {
	return (
		<Box
			className={className}
			sx={{
				textAlign,
				...makeDefaultStyle(lineSpacing, size, weight, color),
				...makeMarginStyle(mt, mb),
			}}
		>
			{children}
		</Box>
	);
};

export const Paragraph: FC<IParagraph> = ({
	className,
	textAlign,
	lineSpacing,
	color,
	size,
	weight,
	mt,
	mb,
	children,
}) => {
	return (
		<Box
			className={className}
			sx={{
				textAlign,
				...makeDefaultStyle(lineSpacing, size, weight, color),
				...makeMarginStyle(mt, mb),
			}}
		>
			{children}
		</Box>
	);
};

export const Sentence: FC<ISentence> = ({
	className,
	textAlign,
	lineSpacing,
	color,
	size,
	weight,
	children,
}) => {
	return (
		<SentenceElement
			className={className}
			sx={{ textAlign, ...makeDefaultStyle(lineSpacing, size, weight, color) }}
		>
			{children}
		</SentenceElement>
	);
};

export default Writing;
