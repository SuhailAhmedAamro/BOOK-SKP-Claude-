import type { ReactNode } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--dark', styles.heroBanner)}>
      <div className="container">
        <div className="row items--center">
          {/* Left Side: Content */}
          <div className="col col--6">
            <Heading as="h1" className={styles.heroTitle}>
              Physical AI & <span className={styles.highlight}>Humanoid</span> Robotics
            </Heading>
            <p className={styles.heroSubtitle}>
              Master Embodied Intelligence. From <strong>ROS 2</strong> Nervous Systems to 
              <strong> Vision-Language-Action (VLA)</strong> Brains.
            </p>
            <div className={styles.buttons}>
              <Link className="button button--primary button--lg shadow--md" to="/docs/BOOK/intro">
                Explore The BOOK 📖
              </Link>
            </div>
          </div>

          {/* Right Side: Badges */}
          <div className="col col--6">
            <div className={styles.badgeColumn}>
              <div className={styles.techBadge}>
                <span className={styles.badgeIcon}>✓</span> NVIDIA Isaac Sim Optimized
              </div>
              <div className={styles.techBadge}>
                <span className={styles.badgeIcon}>✓</span> ROS 2 Humble Framework
              </div>
              <div className={styles.techBadge}>
                <span className={styles.badgeIcon}>✓</span> Ubuntu 22.04 LTS Compatible
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Visual background element */}
      <div className={styles.heroGlow} />
    </header>
  );
}

export default function Home(): ReactNode {
  return (
    <Layout title="Physical AI Portal" description="Panaversity Robotics Curriculum">
      <HomepageHeader />
      <main className={styles.mainContent}>
        
        {/* Section 1: Roadmap */}
        <section className="container padding-vert--xl">
          <div className="text--center margin-bottom--xl">
            <Heading as="h2" className={styles.sectionHeading}>13-Week Masterclass Roadmap</Heading>
          </div>
          
          <div className="row">
            {[
              {
                title: 'The Nervous System',
                img: 'https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg?auto=compress&cs=tinysrgb&w=600',
                desc: 'Weeks 1-5: ROS 2, URDF modeling, and state estimation.'
              },
              {
                title: 'The Digital Twin',
                img: 'https://images.pexels.com/photos/8438918/pexels-photo-8438918.jpeg?auto=compress&cs=tinysrgb&w=600',
                desc: 'Weeks 6-7: Physics-based simulation in Gazebo and Unity.'
              },
              {
                title: 'The AI Brain',
                img: 'https://images.pexels.com/photos/6153354/pexels-photo-6153354.jpeg?auto=compress&cs=tinysrgb&w=600',
                desc: 'Weeks 8-10: NVIDIA Isaac Sim, VSLAM, and Nav2.'
              }
            ].map((feature, idx) => (
              <div key={idx} className="col col--4 margin-bottom--lg">
                <div className={clsx('card shadow--md', styles.infoCard)}>
                  <div className="card__image">
                    <img src={feature.img} alt={feature.title} />
                  </div>
                  <div className="card__body">
                    <Heading as="h3">{feature.title}</Heading>
                    <p>{feature.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2: Hardware Lab */}
        <section className={styles.hardwareSection}>
          <div className="container padding-vert--xl">
            <div className="row items--center">
              <div className="col col--6">
                <Heading as="h2" className={styles.sectionTitle}>Hardware Requirements Lab</Heading>
                <p className="text--italic">Don't just learn. Simulate with real-world power.</p>
                <ul className={styles.specList}>
                  <li><strong>GPU:</strong> RTX 4070 Ti (12GB VRAM)</li>
                  <li><strong>RAM:</strong> 64GB DDR5</li>
                  <li><strong>OS:</strong> Ubuntu 22.04 LTS</li>
                </ul>
              </div>
              <div className="col col--6 text--center">
                <img 
                  src="https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=600" 
                  className={styles.sideImg} 
                  alt="Laboratory" 
                />
              </div>
            </div>
          </div>
        </section>

      </main>
    </Layout>
  );
}