import { css, SerializedStyles } from '@emotion/react';
import { theme, typography, spacing, borderRadius } from '@expo/styleguide';
import * as React from 'react';

import { LinkBase, LinkProps } from './Link';
import { TextComponentProps, TextElement } from './types';

import { AdditionalProps, HeadingType } from '~/common/headingManager';
import Permalink from '~/components/Permalink';
import { durations } from '~/ui/foundations/durations';

export { LinkBase } from './Link';
export { AnchorContext } from './withAnchor';

const CRAWLABLE_HEADINGS = ['h1', 'h2', 'h3', 'h4', 'h5'];
const CRAWLABLE_TEXT = ['span', 'p', 'li', 'blockquote', 'code', 'pre'];

type PermalinkedComponentProps = React.PropsWithChildren<
  { level?: number; id?: string } & AdditionalProps
>;

const isDev = process.env.NODE_ENV === 'development';

export const createPermalinkedComponent = (
  BaseComponent: React.ComponentType<React.PropsWithChildren<any>>,
  options?: {
    baseNestingLevel?: number;
    sidebarType?: HeadingType;
  }
) => {
  const { baseNestingLevel, sidebarType = HeadingType.Text } = options || {};
  return ({ children, level, id, ...props }: PermalinkedComponentProps) => {
    const cleanChildren = React.Children.map(children, child => {
      if (React.isValidElement(child) && child?.props?.href) {
        isDev &&
          console.warn(
            `It looks like the header on this page includes a link, this is an invalid pattern, nested link will be removed!`,
            child?.props?.href
          );
        return (child as JSX.Element)?.props?.children;
      }
      return child;
    });
    const nestingLevel = baseNestingLevel != null ? (level ?? 0) + baseNestingLevel : undefined;
    return (
      <Permalink nestingLevel={nestingLevel} additionalProps={{ ...props, sidebarType }} id={id}>
        <BaseComponent>{cleanChildren}</BaseComponent>
      </Permalink>
    );
  };
};

export function createTextComponent(Element: TextElement, textStyle?: SerializedStyles) {
  function TextComponent(props: TextComponentProps) {
    const { testID, tag, weight: textWeight, theme: textTheme, ...rest } = props;
    const TextElementTag = tag ?? Element;

    return (
      <TextElementTag
        css={[
          baseTextStyle,
          textStyle,
          textWeight && typography.utility.weight[textWeight],
          textTheme && { color: theme.text[textTheme] },
        ]}
        data-testid={testID}
        data-heading={CRAWLABLE_HEADINGS.includes(TextElementTag) || undefined}
        data-text={CRAWLABLE_TEXT.includes(TextElementTag) || undefined}
        {...rest}
      />
    );
  }
  TextComponent.displayName = `Text(${Element})`;
  return TextComponent;
}

const baseTextStyle = css({
  ...typography.body.paragraph,
  color: theme.text.default,
});

const link = css({
  cursor: 'pointer',
  textDecoration: 'none',

  ':hover': {
    transition: durations.hover,
    opacity: 0.8,
  },
});

const linkStyled = css({
  ...typography.utility.anchor,

  // note(Cedric): transform prevents a 1px shift on hover on Safari
  transform: 'translate3d(0,0,0)',

  ':hover': {
    textDecoration: 'underline',

    code: {
      textDecoration: 'inherit',
    },
  },

  'span, code, strong, em, b, i': {
    color: theme.link.default,
  },
});

const listStyle = css({
  marginLeft: '1.5rem',
});

const codeStyle = css({
  borderRadius: borderRadius.small,
  verticalAlign: 'initial',
});

export const kbdStyle = css({
  fontFamily: typography.fontFaces.medium,
  color: theme.text.secondary,
  padding: `0 ${spacing[1]}px`,
  boxShadow: `0 0.1rem 0 1px ${theme.border.default}`,
  borderRadius: borderRadius.small,
  position: 'relative',
  display: 'inline-flex',
  margin: 0,
  minWidth: 22,
  justifyContent: 'center',
  top: -1,
});

const { h1, h2, h3, h4, h5 } = typography.headers.default;
const codeInHeaderStyle = { '& code': { fontSize: 'inherit' } };

const h1Style = {
  ...h1,
  marginTop: spacing[2],
  marginBottom: spacing[6],
  paddingBottom: spacing[4],
  borderBottom: `1px solid ${theme.border.default}`,
  ...codeInHeaderStyle,
};

const h2Style = {
  ...h2,
  marginTop: spacing[8],
  marginBottom: spacing[3],
  ...codeInHeaderStyle,
};

const h3Style = {
  ...h3,
  marginTop: spacing[6],
  marginBottom: spacing[1.5],
  ...codeInHeaderStyle,
};

const h4Style = {
  ...h4,
  marginTop: spacing[6],
  marginBottom: spacing[1],
  ...codeInHeaderStyle,
};

const h5Style = {
  ...h5,
  marginTop: spacing[4],
  marginBottom: spacing[1],
  ...codeInHeaderStyle,
};

export const H1 = createTextComponent(TextElement.H1, css(h1Style));
export const RawH2 = createTextComponent(TextElement.H2, css(h2Style));
export const H2 = createPermalinkedComponent(RawH2, { baseNestingLevel: 2 });
export const RawH3 = createTextComponent(TextElement.H3, css(h3Style));
export const H3 = createPermalinkedComponent(RawH3, { baseNestingLevel: 3 });
export const RawH4 = createTextComponent(TextElement.H4, css(h4Style));
export const H4 = createPermalinkedComponent(RawH4, { baseNestingLevel: 4 });
export const RawH5 = createTextComponent(TextElement.H5, css(h5Style));
export const H5 = createPermalinkedComponent(RawH5, { baseNestingLevel: 5 });

export const P = createTextComponent(TextElement.P, css(typography.body.paragraph));
export const CODE = createTextComponent(
  TextElement.CODE,
  css([typography.utility.inlineCode, codeStyle])
);
export const LI = createTextComponent(TextElement.LI, css(typography.body.li));
export const LABEL = createTextComponent(TextElement.SPAN, css(typography.body.label));
export const HEADLINE = createTextComponent(TextElement.P, css(typography.body.headline));
export const FOOTNOTE = createTextComponent(TextElement.P, css(typography.body.footnote));
export const CALLOUT = createTextComponent(TextElement.P, css(typography.body.callout));
export const BOLD = createTextComponent(
  TextElement.STRONG,
  css(typography.utility.weight.semiBold)
);
export const DEMI = createTextComponent(TextElement.SPAN, css(typography.utility.weight.medium));
export const UL = createTextComponent(TextElement.UL, css([typography.body.ul, listStyle]));
export const OL = createTextComponent(TextElement.OL, css([typography.body.ol, listStyle]));
export const PRE = createTextComponent(TextElement.PRE, css(typography.utility.pre));
export const KBD = createTextComponent(TextElement.KBD, css([typography.utility.pre, kbdStyle]));

const isExternalLink = (href?: string) => href?.includes('://');

export const A = (props: LinkProps & { isStyled?: boolean }) => {
  const { isStyled, ...rest } = props;
  return (
    <LinkBase
      css={[link, !isStyled && linkStyled]}
      openInNewTab={isExternalLink(props.href)}
      {...rest}
    />
  );
};
A.displayName = 'Text(a)';
