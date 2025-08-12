// .eleventy.js

const path = require("path");
const pluginTOC = require('eleventy-plugin-toc');
const pluginDate = require("eleventy-plugin-date");
const markdownIt = require("markdown-it");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const Image = require("@11ty/eleventy-img");


// For flattening objects for testing, can be removed later
const flattenObject = (Object) => {
  const result = {}
  const returnFlatenObject = (obj, parentKey='') => {
      for (key in obj) {
          const newParent = parentKey + key
          const value = obj[key]
          if (typeof value === 'object') {
              returnFlatenObject(value, newParent + '.')
          } else {
              result[newParent] = value
          }
      }
  }
  returnFlatenObject(obj, parent)
  return result
}



// --- Async Shortcode for responsive images (UPDATED) ---
async function imageShortcode(src, alt, customClass = "", sizes = "100vw") {
  if (alt === undefined) {
    throw new Error(`Missing \`alt\` on responsiveimage from: ${src}`);
  }

  let imageSrc = src.startsWith('/')
    ? `.${src}`
    : path.join(path.dirname(this.page.inputPath), src);

  let metadata = await Image(imageSrc, {
    widths: [300, 600, 900, 1200],
    formats: ["avif", "webp", "jpeg"],
    outputDir: "./_site/img/",
    filenameFormat: function (id, src, width, format, options) {
      const extension = path.extname(src);
      const name = path.basename(src, extension);
      return `${name}-${width}w.${format}`;
    }
  });

  let lowsrc = metadata.jpeg[0];
  let highsrc = metadata.jpeg[metadata.jpeg.length - 1];

  return `<picture>
    ${Object.values(metadata).map(imageFormat => {
      return `  <source type="${imageFormat[0].sourceType}" srcset="${imageFormat.map(entry => entry.srcset).join(", ")}" sizes="${sizes}">`;
    }).join("\n")}
      <img
        src="${lowsrc.url}"
        width="${highsrc.width}"
        height="${highsrc.height}"
        alt="${alt}"
        class="${customClass}"
        loading="lazy"
        decoding="async">
    </picture>`;
}

module.exports = function(eleventyConfig) {

  // Activate the RSS/XML plugin
  eleventyConfig.addPlugin(pluginRss);

  // Tell Eleventy to copy the assets folder
  eleventyConfig.addPassthroughCopy("assets");

  // Locale specific assets including lector profile pics, etc
  eleventyConfig.addPassthroughCopy("en/assets");
  eleventyConfig.addPassthroughCopy("sk/assets");



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
  
  // Image shortcode for more responsive and faster images
  eleventyConfig.addNunjucksAsyncShortcode("image", imageShortcode);

  eleventyConfig.addFilter("split", function(string, separator) {
    return string.split(separator);
  });

  eleventyConfig.addFilter("flatten", function(object) {
    return flattenObject(object);
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

  // Override the default table renderer to wrap tables in a div (to enable scrolling on overflow)
  md.renderer.rules.table_open = () => { return '<div class="table-wrapper"><table class="w-full">' };
  md.renderer.rules.table_close = () => { return '</table></div>' };

  // Tell Eleventy to use our custom-configured markdown-it instance
  eleventyConfig.setLibrary("md", md);
  
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