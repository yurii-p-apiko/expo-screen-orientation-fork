import { css } from '@emotion/react';
import { borderRadius, breakpoints, shadows, spacing, theme } from '@expo/styleguide';

import { Icon } from './Icon';

import { A, CALLOUT, RawH4 } from '~/ui/components/Text';

type GridItemProps = React.PropsWithChildren<{
  title: string;
  image?: string;
  href?: string;
  protocol: string[];
}>;

export const GridItem = ({
  title,
  image,
  protocol = [],
  href = `#${title.toLowerCase().replaceAll(' ', '-')}`,
}: GridItemProps) => (
  <A href={href} css={itemStyle} isStyled>
    <Icon title={title} image={image} />
    <RawH4 css={titleStyle}>{title}</RawH4>
    {(protocol || []).length && (
      <CALLOUT theme="secondary" css={protocolStyle}>
        {protocol.join(' | ')}
      </CALLOUT>
    )}
  </A>
);

const protocolStyle = css({
  opacity: 0,
  transform: `translateY(4px)`,
  transitionProperty: 'all',
  transitionDuration: '0.15s',
  textAlign: 'center',
});

const titleStyle = css({
  marginTop: spacing[2],
  textAlign: 'center',
});

const itemStyle = css({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: spacing[6],
  gap: spacing[2],
  textDecoration: 'none',
  borderRadius: borderRadius.small,
  transition: 'box-shadow 0.15s ease 0s, transform 0.15s ease 0s',
  boxShadow: shadows.micro,
  border: `1px solid ${theme.border.default}`,

  ':hover': {
    boxShadow: shadows.small,
    transform: 'scale(1.05)',

    p: {
      opacity: 0.75,
      transform: 'translateY(0)',
    },
  },

  [`@media screen and (max-width: ${(breakpoints.medium + breakpoints.large) / 2}px)`]: {
    p: {
      opacity: 0.75,
    },
  },
});
