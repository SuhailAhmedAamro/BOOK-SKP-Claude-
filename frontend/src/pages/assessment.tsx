import React from 'react';
import Layout from '@theme/Layout';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { FinalAssessment } from '../components/assessment/FinalAssessment';

export default function Assessment(): JSX.Element {
  return (
    <Layout
      title="Final Assessment"
      description="Test your knowledge of Physical AI & Humanoid Robotics"
    >
      <BrowserOnly fallback={<div>Loading...</div>}>
        {() => <FinalAssessment />}
      </BrowserOnly>
    </Layout>
  );
}
