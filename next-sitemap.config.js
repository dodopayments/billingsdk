/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://billingsdk.com',
  generateRobotsTxt: true,
  changefreq: 'weekly',
  priority: 0.6,
  sitemapSize: 7000,
  // Custom transformation function to set different priorities for different pages
  transform: async (config, path) => {
    // Set higher priority for home page
    if (path === '/') {
      return {
        loc: path,
        changefreq: config.changefreq,
        priority: 0.8,
        lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      }
    }

    return {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    }
  },
  // Exclude certain paths if needed
  exclude: [
    '/api/*',
    '/_next/*',
    '/404',
    '/500'
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
  },
}
