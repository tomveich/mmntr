module.exports = {
    layout: "post-layout.njk",
    tags: "post_sk",
    permalink: "/sk/blog/{{ page.fileSlug }}/",
    eleventyComputed: {
        // This is a function that returns the author object
        authorData: (data) => {
          // 'data' is the page's combined data cascade
          if (!data.author) {
            return null;
          }
          // Look up the author ID in the global sk.authors object
          return data.sk.authors[data.author];
        }
      }
}