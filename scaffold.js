const fs = require('fs');
const path = require('path');

const components = {
  layout: ['Navbar', 'Footer', 'Container', 'SectionHeader', 'MobileMenu'],
  home: ['HeroSection', 'CategorySection', 'FeaturedDesigners', 'WhyChooseUs', 'Statistics', 'Testimonials', 'Newsletter', 'FAQ'],
  cards: ['ServiceCard', 'CategoryCard', 'TestimonialCard', 'StatsCard'],
  ui: ['Input', 'Select', 'Textarea', 'Badge', 'Modal', 'Avatar', 'Rating', 'Skeleton', 'Loader', 'EmptyState', 'Pagination'],
  filters: ['SearchBar', 'FilterSidebar', 'SortDropdown'],
  profile: ['DesignerInfo', 'DesignerSkills', 'DesignerSocialLinks'],
  shared: ['ProtectedRoute']
};

const baseDir = path.join(__dirname, 'src', 'components');

Object.entries(components).forEach(([folder, files]) => {
  const folderPath = path.join(baseDir, folder);
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  files.forEach(file => {
    const filePath = path.join(folderPath, `${file}.tsx`);
    if (!fs.existsSync(filePath)) {
      const content = `import React from 'react';\n\nexport const ${file} = () => {\n  return (\n    <div>${file}</div>\n  );\n};\n`;
      fs.writeFileSync(filePath, content);
      console.log(`Created ${folder}/${file}.tsx`);
    }
  });
});

console.log('Component architecture scaffolded successfully!');
