import React from 'react';
import Layout from '@theme-original/DocItem/Layout';
import type LayoutType from '@theme/DocItem/Layout';
import type { WrapperProps } from '@docusaurus/types';
import { useChapterTracking } from '@site/src/hooks/useChapterTracking';

type Props = WrapperProps<typeof LayoutType>;

/**
 * Custom wrapper for DocItem Layout that automatically tracks chapter progress
 * This component wraps every documentation page and tracks when users visit chapters
 */
export default function LayoutWrapper(props: Props): JSX.Element {
  // Automatically track chapter visits
  useChapterTracking();

  return (
    <>
      <Layout {...props} />
    </>
  );
}
