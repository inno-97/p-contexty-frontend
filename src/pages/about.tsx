import type { IProfiles, IProfile, TLink } from 'src/types/profile';

import { Fragment } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Box, Avatar, Stack, Typography, Divider } from '@mui/material';
import { styled } from '@mui/material/styles';

import UsersAPI from 'src/apis/users';

import DefaultLayout from 'src/components/Layout/DefaultLayout';
import { SubContentsLayer } from 'src/components/CustomLayer';
import Contents from 'src/components/Contents';
import { Writing, Paragraph } from 'src/components/Contents/Writing';

import BottomCharacter from '/public/characters/about.png';
import Brunch from '/public/service/brunch.svg';
import Notion from '/public/service/notion.svg';
import Instagram from '/public/service/instagram.svg';
import Github from '/public/service/github.svg';

const BottomImage = styled(Image)(({ theme }) => {
	return {
		color: theme.palette.grey[400],
	};
});

const LinkImage = styled(Image)(({ theme }) => {
	return {
		textTransform: 'none',
		color: theme.palette.grey[400],
	};
});

function getContributorLink(data: TLink, key: string) {
	let svg = null;

	switch (data.name) {
		case 'brunch':
			svg = Brunch;
			break;
		case 'notion':
			svg = Notion;
			break;
		case 'instagram':
			svg = Instagram;
			break;
		case 'github':
			svg = Github;
			break;
		default:
			svg = Brunch;
	}

	return (
		<Link key={key} href={data.link}>
			<a target="_blank" rel="noopener noreferrer">
				<LinkImage alt={data.name + ' Logo'} {...svg} />
			</a>
		</Link>
	);
}

const About = (profiles: IProfiles) => {
	return (
		<Box>
			<SubContentsLayer>
				<Contents title="About">
					{/* Writing */}
					<Writing mb={64} className="ctt_text_16 ctt_regular">
						<Paragraph mb={8} className="ctt_text_18 ctt_bold">
							UX Writing 찾는 고통의 시간을 줄여드릴게요!
						</Paragraph>
						<Paragraph mb={35}>
							사용자를 배려하는 사려깊은 UI Text는 좋은 사용자 경험을 제공하기 위해 꼭
							필요한 요소로 자리잡고 있습니다.
							<br />
							하지만 해외에서 쉽게 찾아볼 수 있는 UX Writing 사례를 국내에서는
							찾아보기 어렵습니다.
							<br />
							그동안 우리는 좋은 문구를 쓰기 위해 여러 서비스를 사용해보며 이미지를
							캡쳐하는 방식으로 레퍼런스를 쌓아 왔습니다.
							<br />
							Contexty는 이러한 레퍼런스를 더욱 효율적으로 수집하고, 적절한 UI Text를
							쓰기 위해 고뇌하는 디자이너들에게
							<br />
							도움이 되길 바라는 마음으로 만들었습니다.
						</Paragraph>
						<Paragraph>
							모든 UI Text는 국내 서비스에서만 수집하고 있고 지속적으로 추가해나갈
							예정입니다.
							<br />
							좋은 UX Writing 사례나 문의사항이 있다면 제보해 주세요!
						</Paragraph>
					</Writing>
					{/* Contributors */}
					<Box height="77px">
						<Paragraph mb={24} className="ctt_text_14 ctt_bold">
							만든 사람들
						</Paragraph>
						<Stack
							alignItems="center"
							direction="row"
							spacing={4}
							divider={
								<div>
									<Divider sx={{ height: 12 }} orientation="vertical" flexItem />
								</div>
							}
						>
							{profiles.datas.map((item: IProfile) => {
								return (
									<Fragment key={item.name}>
										<Stack
											alignItems="center"
											direction="row"
											spacing={1}
											sx={{
												'& > a ': {
													display: 'flex',
												},
											}}
										>
											<Avatar
												alt={item.name}
												sx={{ width: 32, height: 32 }}
												src={`${process.env.NEXT_PUBLIC_STORAGE_URL}/profiles/${item.uuid}.png`}
											/>
											<Typography
												className="ctt_text_14 ctt_bold"
												sx={{
													marginLeft: '4px !important',
												}}
											>
												{item.name}
											</Typography>
											{item.links.map((link) => {
												const key = `${item.name}-${link.name}`;
												return getContributorLink(link, key);
											})}
										</Stack>
									</Fragment>
								);
							})}
						</Stack>
					</Box>

					{/* Bottom Image */}
					<Box sx={{ mt: '80px' }}>
						<BottomImage
							alt="About Page Character"
							{...BottomCharacter}
							width={149}
							height={130}
						/>
					</Box>
				</Contents>
			</SubContentsLayer>
		</Box>
	);
};

export async function getStaticProps() {
	const datas = await UsersAPI.getContributors();
	return {
		props: { datas },
		revalidate: 60 * 60 * 24,
	};
}

About.PageLayout = DefaultLayout;

export default About;
