import Image from 'next/image';
import styles from './HeroSection.module.css';

export default function HeroSection() {
  return (
    <section className={styles.heroContainer}>
      <div className={styles.diagonalBg}></div>
      <div className={`container ${styles.contentWrapper}`}>
        <div className={styles.textColumn}>
          <h1 className={styles.title}>
            YOUR GATEWAY <br /> TO MARKETING <br /> SOLUTIONS
          </h1>
          <p className={styles.subtitle}>One Platform, Endless Opportunities</p>
          <div className={styles.actions}>
            <button className={styles.tryButton}>TRY NOW</button>
            <span>hubungin.com</span>
          </div>
        </div>
        <div className={styles.logoColumn}>
          <div className={styles.logoCircle}>
            <Image src="/logo.svg" alt="Hubung.in Logo" width={150} height={150} />
          </div>
        </div>
      </div>
    </section>
  );
}