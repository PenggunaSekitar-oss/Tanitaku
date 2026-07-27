const fs = require('fs');

function replaceHeader(file, title, subtitle, actionRegex = null) {
  let content = fs.readFileSync(file, 'utf-8');
  
  // Need to make sure import is added
  if (!content.includes('PageHeader')) {
    content = content.replace(/(import React.*?;)/, "$1\nimport { PageHeader } from '../components/PageHeader';");
  }

  // It's a bit hard with regex, let's just do manual string slice since we know the approximate structure
  // Let's use a standard replace for known blocks

  const headerRegex = /<div className="flex flex-col gap-1 w-full">([\s\S]*?)<\/div>/;
  
  // But KeuanganView etc. have slightly different headers, maybe we can just do a very specific regex for each file, or manually edit them.
  fs.writeFileSync(file, content);
}
