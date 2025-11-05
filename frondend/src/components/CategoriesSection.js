import Image from 'next/image';
import styles from './CategoriesSection.module.css';

const categories = [
    { name: 'Content Creators', image: '/illustrations/content-creator.svg' },
    { name: 'Digital Marketing', image: '/illustrations/digital-marketing.svg' },
    { name: 'Script Writers', image: '/illustrations/script-writer.svg' },
    { name: 'Design', image: '/illustrations/design.svg' },
    { name: 'IT', image: '/illustrations/it.svg' },
    { name: 'Data Analyst', image: '/illustrations/data-analyst.svg' },
    { name: 'Animator & Motion Graphic Artist', image: '/illustrations/animator.svg' },
];

export default function CategoriesSection() {
  return (
    <section className={styles.sectionContainer}>
      <div className={`container ${styles.content}`}>
        <h2 className={styles.title}>SAVE BIG IN EVERY PURCHASE</h2>
        <p className={styles.subtitle}>
          Connect with top creators, access powerful marketing services, and grow your brand with ease - all in one platform.
        </p>
        <div className={styles.searchWrapper}>
          <input type="search" placeholder="Search" className={styles.searchBar} />
        </div>
        <div className={styles.categoryGrid}>
          {categories.map((category) => (
            <div key={category.name} className={styles.categoryCard}>
              <Image src={category.image} alt={category.name} width={80} height={80} className="mx-auto" />
              <p className={styles.cardText}>{category.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}