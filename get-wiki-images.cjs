const https = require('https');

async function searchWikiImage(query) {
  return new Promise((resolve) => {
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&srlimit=1`;
    https.get(searchUrl, { headers: { 'User-Agent': 'AIStudio-Agent/1.0 (test@test.com)' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.query.search.length > 0) {
            const title = json.query.search[0].title;
            const imgUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=pageimages&format=json&pithumbsize=600`;
            https.get(imgUrl, { headers: { 'User-Agent': 'AIStudio-Agent/1.0 (test@test.com)' } }, (res2) => {
                let data2 = '';
                res2.on('data', chunk => data2 += chunk);
                res2.on('end', () => {
                    const json2 = JSON.parse(data2);
                    const pages = json2.query.pages;
                    const pageId = Object.keys(pages)[0];
                    if (pages[pageId].thumbnail) {
                        resolve(pages[pageId].thumbnail.source);
                    } else {
                        resolve('NO_THUMB');
                    }
                })
            })
          } else {
            resolve('NO_RESULTS');
          }
        } catch (e) {
          resolve('ERROR');
        }
      });
    });
  });
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function run() {
  const queries = [
    "Begomovirus", "Clubroot", "Alternaria porri",
    "Pectobacterium carotovorum", "Downy mildew", "Powdery mildew", "Damping off"
  ];
  for (let q of queries) {
      console.log(q + ":", await searchWikiImage(q));
      await sleep(500);
  }
}
run();
