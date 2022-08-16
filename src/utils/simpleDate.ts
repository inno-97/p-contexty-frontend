function leftPad(value: number) {
	if (value >= 10) {
		return value;
	}

	return `0${value}`;
}

export function getUnixToYYYYMMDD(unixTime: number) {
	const calendar = new Date(unixTime);

	const year = calendar.getFullYear();
	const month = leftPad(calendar.getMonth() + 1);
	const date = leftPad(calendar.getDate());

	return `${year}.${month}.${date}`;
}
