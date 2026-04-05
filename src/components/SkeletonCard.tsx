import styles from './SkeletonCard.module.css'

export function SkeletonCard() {
  return (
    <div className={styles.card}>
      <div className={styles.thumbnail} />
      <div className={styles.body}>
        <div className={`${styles.line} ${styles.title}`} />
        <div className={`${styles.line} ${styles.desc1}`} />
        <div className={`${styles.line} ${styles.desc2}`} />
        <div className={styles.footer}>
          <div className={`${styles.line} ${styles.tag}`} />
          <div className={`${styles.line} ${styles.tag}`} />
        </div>
      </div>
    </div>
  )
}
