import React from 'react';
import { Skeleton } from 'antd';

const LoadingSkeleton = () => {
  return (
    <div>
      <Skeleton className='mb-5' active />
      <Skeleton active />
    </div>
  );
};

export default LoadingSkeleton;
