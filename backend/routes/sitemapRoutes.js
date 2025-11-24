const express = require("express");
const router = express.Router();
const BlogPost = require("../models/BlogPost");

/**
 * Generate XML Sitemap
 * GET /api/sitemap.xml
 */
router.get("/sitemap.xml", async (req, res) => {
  try {
    // Fetch all published blog posts
    const posts = await BlogPost.find({ status: "published" })
      .select("slug updatedAt")
      .sort({ updatedAt: -1 });

    const baseUrl = process.env.FRONTEND_URL || "https://gisthub.com";
    const currentDate = new Date().toISOString();

    // Build XML sitemap
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    // Homepage
    xml += "  <url>\n";
    xml += `    <loc>${baseUrl}/</loc>\n`;
    xml += `    <lastmod>${currentDate}</lastmod>\n`;
    xml += "    <changefreq>daily</changefreq>\n";
    xml += "    <priority>1.0</priority>\n";
    xml += "  </url>\n";

    // Search page
    xml += "  <url>\n";
    xml += `    <loc>${baseUrl}/search</loc>\n`;
    xml += `    <lastmod>${currentDate}</lastmod>\n`;
    xml += "    <changefreq>weekly</changefreq>\n";
    xml += "    <priority>0.8</priority>\n";
    xml += "  </url>\n";

    // Saved posts page
    xml += "  <url>\n";
    xml += `    <loc>${baseUrl}/saved</loc>\n`;
    xml += `    <lastmod>${currentDate}</lastmod>\n`;
    xml += "    <changefreq>weekly</changefreq>\n";
    xml += "    <priority>0.7</priority>\n";
    xml += "  </url>\n";

    // Profile page
    xml += "  <url>\n";
    xml += `    <loc>${baseUrl}/profile</loc>\n`;
    xml += `    <lastmod>${currentDate}</lastmod>\n`;
    xml += "    <changefreq>monthly</changefreq>\n";
    xml += "    <priority>0.6</priority>\n";
    xml += "  </url>\n";

    // Blog posts
    posts.forEach((post) => {
      xml += "  <url>\n";
      xml += `    <loc>${baseUrl}/${post.slug}</loc>\n`;
      xml += `    <lastmod>${new Date(
        post.updatedAt
      ).toISOString()}</lastmod>\n`;
      xml += "    <changefreq>weekly</changefreq>\n";
      xml += "    <priority>0.9</priority>\n";
      xml += "  </url>\n";
    });

    // Get unique tags
    const allPosts = await BlogPost.find({ status: "published" }).select(
      "tags"
    );
    const uniqueTags = [...new Set(allPosts.flatMap((post) => post.tags))];

    // Tag pages
    uniqueTags.forEach((tag) => {
      xml += "  <url>\n";
      xml += `    <loc>${baseUrl}/tag/${encodeURIComponent(tag)}</loc>\n`;
      xml += `    <lastmod>${currentDate}</lastmod>\n`;
      xml += "    <changefreq>weekly</changefreq>\n";
      xml += "    <priority>0.7</priority>\n";
      xml += "  </url>\n";
    });

    xml += "</urlset>";

    // Set proper content type and send XML
    res.header("Content-Type", "application/xml");
    res.send(xml);
  } catch (error) {
    console.error("Error generating sitemap:", error);
    res.status(500).json({ message: "Error generating sitemap" });
  }
});

/**
 * Generate robots.txt
 * GET /api/robots.txt
 */
router.get("/robots.txt", async (req, res) => {
  const baseUrl = process.env.FRONTEND_URL || "https://gisthub.com";

  const robotsTxt = `# Gist Hub Robots.txt
# Allow all crawlers

User-agent: *
Allow: /

# Sitemap location
Sitemap: ${baseUrl}/api/sitemap.xml

# Disallow admin pages
User-agent: *
Disallow: /admin/
Disallow: /api/

# Crawl delay
Crawl-delay: 1
`;

  res.header("Content-Type", "text/plain");
  res.send(robotsTxt);
});

module.exports = router;
