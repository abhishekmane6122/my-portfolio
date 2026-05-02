const fs = require('fs');
const path = require('path');

const filesToFix = [
  '01_multi_agent_systems_langgraph.json',
  '02_enterprise_rag_systems.json',
  '04_small_language_models.json'
];

const baseDir = 'd:/Abhishek/Abhi_Portfolio/frontend-vite/src/data/blog_json';

filesToFix.forEach(fileName => {
  const filePath = path.join(baseDir, fileName);
  try {
    const rawContent = fs.readFileSync(filePath, 'utf-8');
    
    // Extract metadata fields before "content"
    const idMatch = rawContent.match(/"id":\s*"([^"]+)"/);
    const slugMatch = rawContent.match(/"slug":\s*"([^"]+)"/);
    const titleMatch = rawContent.match(/"title":\s*"([^"]+)"/);
    const excerptMatch = rawContent.match(/"excerpt":\s*"([^"]+)"/);
    
    // Extract metadata fields after "content"
    const publishedAtMatch = rawContent.match(/"publishedAt":\s*"([^"]+)"/);
    const readTimeMatch = rawContent.match(/"readTime":\s*(\d+)/);
    const authorMatch = rawContent.match(/"author":\s*({[^}]+})/);
    const categoryMatch = rawContent.match(/"category":\s*"([^"]+)"/);
    const tagsMatch = rawContent.match(/"tags":\s*(\[[^\]]+\])/);
    const featuredImageMatch = rawContent.match(/"featuredImage":\s*"([^"]+)"/);
    const featuredMatch = rawContent.match(/"featured":\s*(true|false)/);

    // Extract the content. It's between `"content": "` and the next metadata field.
    const contentStartTag = '"content": "';
    const startPos = rawContent.indexOf(contentStartTag) + contentStartTag.length;
    
    // Find the earliest occurrence of any trailing metadata field
    const trailingKeys = ['"publishedAt"', '"author"', '"category"', '"tags"', '"featuredImage"'];
    let endPos = -1;
    for (const key of trailingKeys) {
        const pos = rawContent.indexOf(key, startPos);
        if (pos !== -1) {
            if (endPos === -1 || pos < endPos) {
                endPos = pos;
            }
        }
    }

    if (startPos !== -1 && endPos !== -1) {
        let content = rawContent.substring(startPos, endPos).trim();
        
        // Remove trailing quote and comma if present
        if (content.endsWith('",')) content = content.slice(0, -2);
        else if (content.endsWith('"')) content = content.slice(0, -1);
        
        // Treat the entire block as raw text.
        // We need to unescape \n and \" to get the raw markdown.
        let rawMarkdown = content.replace(/\\n/g, '\n').replace(/\\"/g, '"');

        const finalObj = {
            id: idMatch ? idMatch[1] : "",
            slug: slugMatch ? slugMatch[1] : "",
            title: titleMatch ? titleMatch[1] : "",
            excerpt: excerptMatch ? excerptMatch[1] : "",
            content: rawMarkdown,
            publishedAt: publishedAtMatch ? publishedAtMatch[1] : "",
            readTime: readTimeMatch ? parseInt(readTimeMatch[1]) : 0,
            author: authorMatch ? JSON.parse(authorMatch[1]) : {},
            category: categoryMatch ? categoryMatch[1] : "",
            tags: tagsMatch ? JSON.parse(tagsMatch[1]) : [],
            featuredImage: featuredImageMatch ? featuredImageMatch[1] : "",
            featured: featuredMatch ? featuredMatch[1] === 'true' : false
        };

        fs.writeFileSync(filePath, JSON.stringify(finalObj, null, 4), 'utf-8');
        console.log(`✓ Fixed ${fileName}`);
    } else {
        console.error(`✗ Could not find content boundaries for ${fileName}`);
    }

  } catch (err) {
    console.error(`Error fixing ${fileName}: ${err.message}`);
  }
});
