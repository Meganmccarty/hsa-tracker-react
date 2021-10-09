import loadingGIF from '../loading.gif';
import styles from './Loading.module.css'

function Loading() {
    return <img src={loadingGIF} alt="Loading..." className={styles.loading}/>
};

export default Loading;