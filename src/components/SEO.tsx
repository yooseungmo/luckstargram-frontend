// src/components/SEO.tsx
import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  image: string;
  url: string;
}

/**
 * 재사용 가능한 SEO 컴포넌트
 * React Helmet Async를 사용하여
 * 페이지별로 동적 메타태그를 설정합니다.
 */
const SEO: React.FC<SEOProps> = ({ title, description, image, url }) => {
  return (
    <Helmet>
      {/* Document Title */}
      <title>{title}</title>

      {/* 기본 Description */}
      <meta name="description" content={description} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:locale" content="ko_KR" />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
};

export default SEO;