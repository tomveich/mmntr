module.exports = {
    layout: "post-layout.njk",
    tags: "post_en",
    permalink: "/blog/{{ title | slug }}/",
    eleventyComputed: {
        // This is a function that returns the author object
        authorData: (data) => {
          // 'data' is the page's combined data cascade
          if (!data.author) {
            return null;
          }
          // Look up the author ID in the global en.authors object
          return data.en.authors[data.author];
        }
    }
}