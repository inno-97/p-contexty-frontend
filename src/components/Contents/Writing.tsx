import type { FC } from 'react';
import type { SystemCssProperties } from '@mui/system';
import type { IWriting, IParagraph, ISentence } from 'src/types/components';

import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

const SentenceElement = styled('p')({});

function makeDefaultStyle(lineSpacing?: number, size?: string, weight?: string) {
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
	lineSpacing,
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
				...makeDefaultStyle(lineSpacing, size, weight),
				...makeMarginStyle(mt, mb),
			}}
		>
			{children}
		</Box>
	);
};

export const Paragraph: FC<IParagraph> = ({
	className,
	lineSpacing,
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
				...makeDefaultStyle(lineSpacing, size, weight),
				...makeMarginStyle(mt, mb),
			}}
		>
			{children}
		</Box>
	);
};

export const Sentence: FC<ISentence> = ({ className, lineSpacing, size, weight, children }) => {
	return (
		<SentenceElement className={className} sx={makeDefaultStyle(lineSpacing, size, weight)}>
			{children}
		</SentenceElement>
	);
};

export default Writing;
