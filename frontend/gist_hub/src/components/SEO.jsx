import { Helmet } from "react-helmet-async";
import PropTypes from "prop-types";

/**
 * SEO Component - Manages dynamic meta tags for pages
 * Supports Open Graph, Twitter Cards, and standard SEO meta tags
 */
const SEO = ({
  title,
  description,
  image,
  url,
  type = "website",
  article = null,
  keywords = [],
  author = "Gist Hub",
  canonicalUrl = null,
}) => {
  const siteTitle = "Gist Hub";
  const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  const siteUrl = "https://gisthub.com"; // Replace with your actual domain
  const fullUrl = url ? `${siteUrl}${url}` : siteUrl;
  const fullCanonicalUrl = canonicalUrl || fullUrl;
  const defaultDescription =
    "Discover insightful articles, tutorials, and stories on Gist Hub - your source for quality content.";
  const metaDescription = description || defaultDescription;
  const defaultImage = `${siteUrl}/og-image.jpg`; // Create a default OG image
  const metaImage = image
    ? image.startsWith("http")
      ? image
      : `${siteUrl}${image}`
    : defaultImage;

  // Generate keywords string
  const keywordsString =
    keywords.length > 0
      ? keywords.join(", ")
      : "blog, articles, tutorials, tech, programming";

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={keywordsString} />
      <meta name="author" content={author} />
      <link rel="canonical" href={fullCanonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:image:alt" content={title || siteTitle} />
      <meta property="og:site_name" content={siteTitle} />
      <meta property="og:locale" content="en_US" />

      {/* Article-specific Open Graph tags */}
      {article && type === "article" && (
        <>
          {article.publishedTime && (
            <meta
              property="article:published_time"
              content={article.publishedTime}
            />
          )}
          {article.modifiedTime && (
            <meta
              property="article:modified_time"
              content={article.modifiedTime}
            />
          )}
          {article.author && (
            <meta property="article:author" content={article.author} />
          )}
          {article.section && (
            <meta property="article:section" content={article.section} />
          )}
          {article.tags &&
            article.tags.length > 0 &&
            article.tags.map((tag, index) => (
              <meta key={index} property="article:tag" content={tag} />
            ))}
        </>
      )}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImage} />
      <meta name="twitter:image:alt" content={title || siteTitle} />
      {/* Add your Twitter handle if you have one */}
      {/* <meta name="twitter:site" content="@yourtwitterhandle" /> */}
      {/* <meta name="twitter:creator" content="@yourtwitterhandle" /> */}

      {/* Additional Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      {/* Favicon - ensure these exist in your public folder */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />
    </Helmet>
  );
};

SEO.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  image: PropTypes.string,
  url: PropTypes.string,
  type: PropTypes.oneOf(["website", "article", "profile"]),
  article: PropTypes.shape({
    publishedTime: PropTypes.string,
    modifiedTime: PropTypes.string,
    author: PropTypes.string,
    section: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
  }),
  keywords: PropTypes.arrayOf(PropTypes.string),
  author: PropTypes.string,
  canonicalUrl: PropTypes.string,
};

export default SEO;
