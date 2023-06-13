import type { PropsWithChildren } from 'react';

function NoLayout(props: PropsWithChildren) {
	return <main>{props.children}</main>;
}

export default NoLayout;
