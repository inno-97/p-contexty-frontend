import type { PropsWithChildren } from 'react';
import { Fragment } from 'react';

function NoLayout(props: PropsWithChildren) {
	return <Fragment>{props.children}</Fragment>;
}

export default NoLayout;
