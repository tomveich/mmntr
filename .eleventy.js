// .eleventy.js

const pluginTOC = require('eleventy-plugin-toc');
const pluginDate = require("eleventy-plugin-date");
const markdownIt = require("markdown-it");
const pluginRss = require("@11ty/eleventy-plugin-rss");

module.exports = function(eleventyConfig) {

  // Activate the RSS/XML plugin
  eleventyConfig.addPlugin(pluginRss);

  // Tell Eleventy to copy the assets folder
  eleventyConfig.addPassthroughCopy("assets");

  // Also copy images for blog posts
  eleventyConfig.addPassthroughCopy("sk/blog/**/*.{jpg,jpeg,png,gif,svg}");
  eleventyConfig.addPassthroughCopy("en/blog/**/*.{jpg,jpeg,png,gif,svg}");

  // Also copy robots.txt
  eleventyConfig.addPassthroughCopy("robots.txt");
  
  // Activate the Table of Contents plugin
  eleventyConfig.addPlugin(pluginTOC, {
    tags: ['h2', 'h3'],
    wrapper: 'div',
    wrapperClass: 'toc prose prose-sm bg-slate-100 dark:bg-slate-800 p-4 rounded-lg'
  });
  
  // Activate the Date plugin with our custom named formats
  eleventyConfig.addPlugin(pluginDate, {
    formats: {
      // Creates a filter named | displayDate
      displayDate: 'd. M. yyyy',
      // Creates a filter named | isoDate
      isoDate: 'yyyy-MM-dd'
    }
  });
  
  eleventyConfig.addFilter("where", function(array, key, value) {
    return array.filter(item => {
      // Handle nested keys like "data.author"
      const keys = key.split('.');
      let current = item;
      for (const k of keys) {
        if (current === undefined) return false;
        current = current[k];
      }
      return current === value;
    });
  });

  // For making image grids
  eleventyConfig.addPairedShortcode("imagegrid", function(content) {
    // Process the content as inline Markdown to generate <img> tags
    const renderedContent = md.renderInline(content);
    return `<div class="grid grid-cols-2 md:grid-cols-3 gap-4 my-8">${renderedContent}</div>`;
  });
  // END: Add the new image-grid shortcode
  

  eleventyConfig.addFilter("split", function(string, separator) {
    return string.split(separator);
  });


  // For SEO purposes - To tell google that the slovak pricing page is just a slovak
  // variation of the english pricing page. For this, we need to create a collection
  // of pages with the same meaning just in different locales.

    // START: Add new collection for i18n
    eleventyConfig.addCollection("pagesByTranslation", (collectionApi) => {
      const pages = {};
      for (const page of collectionApi.getAll()) {
        const key = page.data.translationKey;
        if (key) {
          if (!pages[key]) {
            pages[key] = [];
          }
          pages[key].push(page);
        }
      }
      return pages;
    });
    // 

  const md = new markdownIt({
    html: true,
  });

  eleventyConfig.addFilter("markdown", (content) => {
    return md.render(content);
  });

  eleventyConfig.addCollection("post_sk", (collectionApi) => {
    return collectionApi.getFilteredByGlob("./sk/blog/**/*.md");
  });

  eleventyConfig.addCollection("post_en", (collectionApi) => {
    return collectionApi.getFilteredByGlob("./en/blog/**/*.md");
  });

  return {
    dir: {
      input: ".",
      includes: "_includes",
      output: "_site",
    },
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    markdownTemplateEngine: "njk"
  };
};