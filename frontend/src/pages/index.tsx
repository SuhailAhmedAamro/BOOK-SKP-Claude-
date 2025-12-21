import type { ReactNode } from 'react';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { useHistory } from '@docusaurus/router';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../contexts/LanguageContext';
import PageTransition from '../components/common/PageTransition';

import styles from './index.module.css';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  const { isAuthenticated } = useAuth();
  const { language, t } = useLanguage();
  const history = useHistory();

  const handleExploreClick = () => {
    if (!isAuthenticated) {
      history.push('/auth/signin?redirect=/docs/BOOK/intro');
    } else {
      history.push('/docs/BOOK/intro');
    }
  };

  return (
    <header
      className={clsx('hero hero--dark', styles.heroBanner)}
      style={language === 'ur' ? { fontFamily: "'Noto Sans Arabic', sans-serif" } : {}}
    >
      <div className="container">
        <div className="row items--center">
          {/* Left Side: Content */}
          <div className="col col--6" dir={language === 'ur' ? 'rtl' : 'ltr'}>
            <Heading as="h1" className={styles.heroTitle}>
              {t('home.title')}
            </Heading>
            <p className={styles.heroSubtitle}>
              {t('home.subtitle')}
            </p>
            <div className={styles.buttons}>
              <button
                onClick={handleExploreClick}
                className="button button--primary button--lg shadow--md btn-ripple scale-hover"
              >
                {t('home.exploreButton')}
              </button>
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
  const { language, t } = useLanguage();

  return (
    <Layout title="Physical AI Portal" description="Panaversity Robotics Curriculum">
      <PageTransition variant="fade">
        <HomepageHeader />
        <main
          className={styles.mainContent}
          style={language === 'ur' ? { fontFamily: "'Noto Sans Arabic', sans-serif" } : {}}
        >
        
        {/* Section 1: Roadmap */}
        <section className="container padding-vert--xl" dir={language === 'ur' ? 'rtl' : 'ltr'}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text--center margin-bottom--xl"
          >
            <Heading as="h2" className={styles.sectionHeading}>{t('home.roadmapTitle')}</Heading>
          </motion.div>

          <div className="row">
            {[
              {
                titleKey: 'roadmap.nervousSystem',
                img: 'https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg?auto=compress&cs=tinysrgb&w=600',
                descKey: 'roadmap.nervousDesc'
              },
              {
                titleKey: 'roadmap.digitalTwin',
                img: 'https://images.pexels.com/photos/8438918/pexels-photo-8438918.jpeg?auto=compress&cs=tinysrgb&w=600',
                descKey: 'roadmap.digitalDesc'
              },
              {
                titleKey: 'roadmap.aiBrain',
                img: 'https://images.pexels.com/photos/6153354/pexels-photo-6153354.jpeg?auto=compress&cs=tinysrgb&w=600',
                descKey: 'roadmap.aiDesc'
              }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2, duration: 0.5 }}
                className="col col--4 margin-bottom--lg px-4"
              >
                <div className={clsx('card shadow--md', styles.infoCard)}>
                  <div className="card__image">
                    <img src={feature.img} alt={t(feature.titleKey)} />
                  </div>
                  <div className="card__body">
                    <Heading as="h3">{t(feature.titleKey)}</Heading>
                    <p>{t(feature.descKey)}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Section 2: Hardware Lab */}
        <section className={styles.hardwareSection}>
          <div className="container padding-vert--xl" dir={language === 'ur' ? 'rtl' : 'ltr'}>
            <div className="row items--center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="col col--6"
              >
                <Heading as="h2" className={styles.sectionTitle}>{t('home.hardwareTitle')}</Heading>
                <p className="text--italic">{t('home.hardwareSubtitle')}</p>
                <ul className={styles.specList}>
                  <motion.li
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                  >
                    <strong>GPU:</strong> RTX 4070 Ti (12GB VRAM)
                  </motion.li>
                  <motion.li
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                  >
                    <strong>RAM:</strong> 64GB DDR5
                  </motion.li>
                  <motion.li
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                  >
                    <strong>OS:</strong> Ubuntu 22.04 LTS
                  </motion.li>
                </ul>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="col col--6 text--center"
              >
                <img
                  src="https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=600"
                  className={styles.sideImg}
                  alt="Laboratory"
                />
              </motion.div>
            </div>
          </div>
        </section>

        </main>
      </PageTransition>
    </Layout>
  );
}