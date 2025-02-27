import { css } from '@emotion/react';
import { iconSize, spacing, ThumbsDownIcon, ThumbsUpIcon } from '@expo/styleguide';
import { useState } from 'react';

import { Button } from '../Button';
import { CALLOUT } from '../Text';

import { reportPageVote } from '~/providers/Analytics';

export const PageVote = () => {
  const [userVoted, setUserVoted] = useState(false);
  return (
    <div css={wrapperStyle}>
      <CALLOUT theme="secondary" weight="medium">
        Was this doc helpful?
      </CALLOUT>
      {userVoted ? (
        <CALLOUT theme="secondary" css={ratedTextStyle}>
          Thank you for your vote! 💜
        </CALLOUT>
      ) : (
        <div css={voteButtonsWrapperStyle}>
          <Button
            theme="secondary"
            size="mini"
            aria-label="Vote up"
            css={voteButtonStyle}
            onClick={() => {
              reportPageVote({ status: true });
              setUserVoted(true);
            }}>
            <ThumbsUpIcon size={iconSize.small} />
          </Button>
          <Button
            theme="secondary"
            size="mini"
            aria-label="Vote down"
            css={voteButtonStyle}
            onClick={() => {
              reportPageVote({ status: false });
              setUserVoted(true);
            }}>
            <ThumbsDownIcon size={iconSize.small} />
          </Button>
        </div>
      )}
    </div>
  );
};

const wrapperStyle = css({
  minWidth: 200,
});

const voteButtonsWrapperStyle = css({
  display: 'flex',
  flexDirection: 'row',
});

const voteButtonStyle = css({
  margin: `${spacing[2.5]}px ${spacing[1]}px 0`,
  minWidth: 42,
  textAlign: 'center',
});

const ratedTextStyle = css({
  padding: `${spacing[3]}px 0`,
});
