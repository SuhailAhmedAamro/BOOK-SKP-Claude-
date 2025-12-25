import React from 'react';
import Footer from '@theme-original/DocItem/Footer';
import type FooterType from '@theme/DocItem/Footer';
import type { WrapperProps } from '@docusaurus/types';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { ChapterCompleteButton } from '@site/src/components/chapter/ChapterCompleteButton';

type Props = WrapperProps<typeof FooterType>;

/**
 * Custom wrapper for DocItem Footer that adds "Mark as Complete" button
 */
export default function FooterWrapper(props: Props): JSX.Element {
  return (
    <>
      <BrowserOnly fallback={<div />}>
        {() => <ChapterCompleteButton />}
      </BrowserOnly>
      <Footer {...props} />
    </>
  );
}
