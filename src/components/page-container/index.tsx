import React from 'react';
import styles from './index.module.less';

function PageContainer({ children }: React.PropsWithChildren<unknown>) {
  return <div className={styles['page-container']}>{children}</div>;
}

export default PageContainer;
