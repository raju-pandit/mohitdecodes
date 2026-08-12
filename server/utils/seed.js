const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../models/User');
const Course = require('../models/Course');
const Tutorial = require('../models/Tutorial');
const Blog = require('../models/Blog');
const Resource = require('../models/Resource');
const Project = require('../models/Project');
const Roadmap = require('../models/Roadmap');
const Testimonial = require('../models/Testimonial');
const Newsletter = require('../models/Newsletter');

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ MongoDB Connected for seeding...');
};

// ============ SEED DATA ============

const users = [
  {
    name: process.env.ADMIN_NAME || 'Mohit Admin',
    email: process.env.ADMIN_EMAIL || 'admin@mohitdecodes.com',
    password: process.env.ADMIN_PASSWORD || 'Admin@123456',
    role: 'admin',
    avatar: 'https://ui-avatars.com/api/?background=7c3aed&color=fff&name=Mohit+Admin&size=200'
  },
  { name: 'Rahul Sharma', email: 'rahul@example.com', password: 'Password123', role: 'user' },
  { name: 'Priya Singh', email: 'priya@example.com', password: 'Password123', role: 'user' },
  { name: 'Aman Gupta', email: 'aman@example.com', password: 'Password123', role: 'user' },
];

const courses = [
  {
    title: 'Complete JavaScript Mastery',
    description: 'Master JavaScript from basics to advanced concepts including ES6+, async/await, closures, prototypes, and modern JS patterns. Build real projects along the way.',
    shortDescription: 'From zero to hero in JavaScript. Covers ES6+, async/await, DOM, APIs.',
    thumbnail: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=800&q=80',
    instructor: { name: 'Mohit Decodes', avatar: 'https://ui-avatars.com/api/?background=7c3aed&color=fff&name=Mohit', bio: 'Full Stack Developer with 5+ years of experience' },
    category: 'JavaScript',
    difficulty: 'Beginner',
    price: 0,
    isFree: true,
    duration: '24 hours',
    students: 15420,
    rating: { average: 4.8, count: 2341 },
    tags: ['javascript', 'es6', 'web development', 'programming'],
    isPublished: true,
    featured: true,
    whatYouLearn: ['JavaScript fundamentals', 'ES6+ features', 'Async programming', 'DOM manipulation', 'Real projects'],
    requirements: ['Basic computer knowledge', 'Text editor installed'],
    modules: [
      {
        title: 'JavaScript Fundamentals', order: 1,
        lessons: [
          { title: 'Introduction to JavaScript', duration: '15 min', isFree: true, order: 1 },
          { title: 'Variables and Data Types', duration: '20 min', isFree: true, order: 2 },
          { title: 'Functions and Scope', duration: '25 min', isFree: false, order: 3 },
          { title: 'Arrays and Objects', duration: '30 min', isFree: false, order: 4 },
        ]
      },
      {
        title: 'ES6+ Modern JavaScript', order: 2,
        lessons: [
          { title: 'Arrow Functions', duration: '18 min', isFree: false, order: 1 },
          { title: 'Destructuring & Spread', duration: '22 min', isFree: false, order: 2 },
          { title: 'Promises and Async/Await', duration: '35 min', isFree: false, order: 3 },
          { title: 'Modules (Import/Export)', duration: '20 min', isFree: false, order: 4 },
        ]
      }
    ]
  },
  {
    title: 'React.js Complete Course 2024',
    description: 'Learn React.js from scratch. Build modern, scalable web applications using hooks, context API, React Router, and connect to real backends.',
    shortDescription: 'Build real React apps with Hooks, Context, Router, and APIs.',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80',
    instructor: { name: 'Mohit Decodes', avatar: 'https://ui-avatars.com/api/?background=7c3aed&color=fff&name=Mohit', bio: 'Full Stack Developer' },
    category: 'React',
    difficulty: 'Intermediate',
    price: 499,
    isFree: false,
    duration: '30 hours',
    students: 8930,
    rating: { average: 4.9, count: 1567 },
    tags: ['react', 'hooks', 'javascript', 'frontend'],
    isPublished: true,
    featured: true,
    modules: [
      {
        title: 'React Fundamentals', order: 1,
        lessons: [
          { title: 'What is React?', duration: '12 min', isFree: true, order: 1 },
          { title: 'JSX and Components', duration: '25 min', isFree: true, order: 2 },
          { title: 'Props and State', duration: '30 min', isFree: false, order: 3 },
          { title: 'Event Handling', duration: '20 min', isFree: false, order: 4 },
        ]
      },
      {
        title: 'React Hooks', order: 2,
        lessons: [
          { title: 'useState Hook', duration: '20 min', isFree: false, order: 1 },
          { title: 'useEffect Hook', duration: '28 min', isFree: false, order: 2 },
          { title: 'useContext and Custom Hooks', duration: '35 min', isFree: false, order: 3 },
        ]
      }
    ]
  },
  {
    title: 'Node.js & Express Backend Development',
    description: 'Build robust REST APIs with Node.js and Express. Learn middleware, authentication, database integration, and deployment best practices.',
    shortDescription: 'Build REST APIs with Node.js, Express, and MongoDB.',
    thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80',
    instructor: { name: 'Mohit Decodes', avatar: 'https://ui-avatars.com/api/?background=7c3aed&color=fff&name=Mohit', bio: 'Backend Engineer' },
    category: 'Node.js',
    difficulty: 'Intermediate',
    price: 399,
    isFree: false,
    duration: '20 hours',
    students: 6720,
    rating: { average: 4.7, count: 890 },
    tags: ['nodejs', 'express', 'backend', 'api', 'rest'],
    isPublished: true,
    featured: true,
    modules: [
      {
        title: 'Node.js Basics', order: 1,
        lessons: [
          { title: 'Node.js Introduction', duration: '15 min', isFree: true, order: 1 },
          { title: 'NPM and Modules', duration: '20 min', isFree: true, order: 2 },
          { title: 'File System & Events', duration: '25 min', isFree: false, order: 3 },
        ]
      }
    ]
  },
  {
    title: 'MERN Stack Full Course',
    description: 'Build complete full-stack applications with MongoDB, Express, React, and Node.js. Create 3 complete projects including an e-commerce platform.',
    shortDescription: 'Complete MERN Stack development from scratch to deployment.',
    thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&q=80',
    instructor: { name: 'Mohit Decodes', avatar: 'https://ui-avatars.com/api/?background=7c3aed&color=fff&name=Mohit', bio: 'Full Stack Developer' },
    category: 'MERN',
    difficulty: 'Advanced',
    price: 799,
    isFree: false,
    duration: '50 hours',
    students: 12450,
    rating: { average: 4.9, count: 2100 },
    tags: ['mern', 'mongodb', 'express', 'react', 'nodejs', 'fullstack'],
    isPublished: true,
    featured: true,
    modules: [
      {
        title: 'Project 1: Blog Platform', order: 1,
        lessons: [
          { title: 'Project Setup', duration: '20 min', isFree: true, order: 1 },
          { title: 'Backend API Design', duration: '40 min', isFree: false, order: 2 },
          { title: 'Frontend Integration', duration: '45 min', isFree: false, order: 3 },
        ]
      }
    ]
  },
  {
    title: 'DSA with JavaScript',
    description: 'Master Data Structures and Algorithms using JavaScript. Covers arrays, linked lists, trees, graphs, dynamic programming, and 100+ coding problems.',
    shortDescription: 'Crack coding interviews with DSA in JavaScript.',
    thumbnail: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&q=80',
    instructor: { name: 'Mohit Decodes', avatar: 'https://ui-avatars.com/api/?background=7c3aed&color=fff&name=Mohit', bio: 'Software Engineer' },
    category: 'DSA',
    difficulty: 'Intermediate',
    price: 0,
    isFree: true,
    duration: '35 hours',
    students: 9870,
    rating: { average: 4.8, count: 1450 },
    tags: ['dsa', 'algorithms', 'data structures', 'interview prep'],
    isPublished: true,
    modules: [
      {
        title: 'Arrays & Strings', order: 1,
        lessons: [
          { title: 'Array Basics', duration: '20 min', isFree: true, order: 1 },
          { title: 'Two Pointer Technique', duration: '30 min', isFree: false, order: 2 },
          { title: 'Sliding Window', duration: '35 min', isFree: false, order: 3 },
        ]
      }
    ]
  },
  {
    title: 'MongoDB Complete Guide',
    description: 'Learn MongoDB from basics to advanced. Covers CRUD operations, aggregation pipeline, indexes, performance optimization, and Mongoose ORM.',
    shortDescription: 'Master MongoDB and Mongoose for Node.js applications.',
    thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&q=80',
    instructor: { name: 'Mohit Decodes', avatar: 'https://ui-avatars.com/api/?background=7c3aed&color=fff&name=Mohit', bio: 'Database Engineer' },
    category: 'MongoDB',
    difficulty: 'Beginner',
    price: 299,
    isFree: false,
    duration: '15 hours',
    students: 4320,
    rating: { average: 4.6, count: 670 },
    tags: ['mongodb', 'mongoose', 'database', 'nosql'],
    isPublished: true,
    modules: [
      {
        title: 'MongoDB Fundamentals', order: 1,
        lessons: [
          { title: 'What is MongoDB?', duration: '15 min', isFree: true, order: 1 },
          { title: 'CRUD Operations', duration: '30 min', isFree: false, order: 2 },
        ]
      }
    ]
  },
  {
    title: 'TypeScript for React Developers',
    description: 'Add TypeScript to your React workflow. Type safety, interfaces, generics, and converting existing React projects to TypeScript.',
    shortDescription: 'Build type-safe React apps with TypeScript.',
    thumbnail: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=800&q=80',
    instructor: { name: 'Mohit Decodes', avatar: 'https://ui-avatars.com/api/?background=7c3aed&color=fff&name=Mohit', bio: 'Frontend Architect' },
    category: 'Frontend',
    difficulty: 'Intermediate',
    price: 349,
    isFree: false,
    duration: '12 hours',
    students: 3450,
    rating: { average: 4.7, count: 540 },
    tags: ['typescript', 'react', 'frontend', 'type safety'],
    isPublished: true,
    modules: [
      {
        title: 'TypeScript Basics', order: 1,
        lessons: [
          { title: 'Why TypeScript?', duration: '10 min', isFree: true, order: 1 },
          { title: 'Types and Interfaces', duration: '25 min', isFree: false, order: 2 },
        ]
      }
    ]
  },
  {
    title: 'Git & GitHub for Developers',
    description: 'Master version control with Git and GitHub. Learn branching, merging, pull requests, CI/CD, and collaborative development workflows.',
    shortDescription: 'Master Git & GitHub for professional development.',
    thumbnail: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=800&q=80',
    instructor: { name: 'Mohit Decodes', avatar: 'https://ui-avatars.com/api/?background=7c3aed&color=fff&name=Mohit', bio: 'DevOps Engineer' },
    category: 'Other',
    difficulty: 'Beginner',
    price: 0,
    isFree: true,
    duration: '8 hours',
    students: 21000,
    rating: { average: 4.9, count: 3200 },
    tags: ['git', 'github', 'version control', 'devops'],
    isPublished: true,
    featured: true,
    modules: [
      {
        title: 'Git Fundamentals', order: 1,
        lessons: [
          { title: 'What is Git?', duration: '10 min', isFree: true, order: 1 },
          { title: 'Git Commands', duration: '25 min', isFree: true, order: 2 },
          { title: 'Branching Strategies', duration: '30 min', isFree: false, order: 3 },
        ]
      }
    ]
  }
];

const tutorials = [
  {
    title: 'How to Set Up a React Project with Vite',
    content: '# Setting Up React with Vite\n\nVite is a next-generation build tool that significantly improves the frontend development experience.\n\n## Installation\n\n```bash\nnpm create vite@latest my-app --template react\ncd my-app\nnpm install\nnpm run dev\n```\n\n## Why Vite?\n- Extremely fast HMR\n- Native ES modules\n- Optimized production builds\n- Plugin ecosystem\n\nVite uses native browser ES modules during development, which means no bundling required and near-instant server start.',
    excerpt: 'Learn how to set up a modern React project with Vite for lightning-fast development.',
    category: 'React',
    difficulty: 'Beginner',
    author: { name: 'Mohit Decodes', avatar: 'https://ui-avatars.com/api/?background=7c3aed&color=fff&name=Mohit' },
    tags: ['react', 'vite', 'setup', 'frontend'],
    published: true,
    featured: true,
    coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80'
  },
  {
    title: 'JavaScript Promises vs Async/Await Explained',
    content: '# Promises vs Async/Await\n\nUnderstanding asynchronous JavaScript is crucial for modern web development.\n\n## Promises\n\n```javascript\nfetch("/api/data")\n  .then(res => res.json())\n  .then(data => console.log(data))\n  .catch(err => console.error(err));\n```\n\n## Async/Await\n\n```javascript\nasync function fetchData() {\n  try {\n    const res = await fetch("/api/data");\n    const data = await res.json();\n    console.log(data);\n  } catch (err) {\n    console.error(err);\n  }\n}\n```\n\nAsync/await is syntactic sugar over promises, making async code look synchronous and easier to read.',
    excerpt: 'Deep dive into JavaScript async patterns - Promises vs Async/Await with real examples.',
    category: 'JavaScript',
    difficulty: 'Intermediate',
    author: { name: 'Mohit Decodes', avatar: 'https://ui-avatars.com/api/?background=7c3aed&color=fff&name=Mohit' },
    tags: ['javascript', 'async', 'promises', 'es6'],
    published: true,
    featured: true,
    coverImage: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=800&q=80'
  },
  {
    title: 'Building REST APIs with Express.js',
    content: '# Building REST APIs with Express.js\n\nExpress.js is the most popular Node.js framework for building web applications and APIs.\n\n## Quick Setup\n\n```bash\nnpm init -y\nnpm install express\n```\n\n```javascript\nconst express = require("express");\nconst app = express();\n\napp.use(express.json());\n\napp.get("/api/users", (req, res) => {\n  res.json({ success: true, data: [] });\n});\n\napp.listen(5000, () => console.log("Server running on port 5000"));\n```\n\n## REST Principles\n- GET - Retrieve resources\n- POST - Create resources\n- PUT/PATCH - Update resources\n- DELETE - Delete resources',
    excerpt: 'Step-by-step guide to building production-ready REST APIs with Express.js.',
    category: 'Node.js',
    difficulty: 'Beginner',
    author: { name: 'Mohit Decodes', avatar: 'https://ui-avatars.com/api/?background=7c3aed&color=fff&name=Mohit' },
    tags: ['nodejs', 'express', 'rest api', 'backend'],
    published: true,
    coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80'
  },
  {
    title: 'Complete Guide to React Hooks',
    content: '# React Hooks Complete Guide\n\nHooks revolutionized React development. Here are the essential hooks you need to know.\n\n## useState\n```jsx\nconst [count, setCount] = useState(0);\n```\n\n## useEffect\n```jsx\nuseEffect(() => {\n  document.title = `Count: ${count}`;\n}, [count]);\n```\n\n## useContext\n```jsx\nconst theme = useContext(ThemeContext);\n```\n\n## Custom Hooks\n```jsx\nfunction useLocalStorage(key, initialValue) {\n  const [value, setValue] = useState(() => {\n    return localStorage.getItem(key) || initialValue;\n  });\n  return [value, setValue];\n}\n```',
    excerpt: 'Master all React hooks including useState, useEffect, useContext, and custom hooks.',
    category: 'React',
    difficulty: 'Intermediate',
    author: { name: 'Mohit Decodes', avatar: 'https://ui-avatars.com/api/?background=7c3aed&color=fff&name=Mohit' },
    tags: ['react', 'hooks', 'useState', 'useEffect'],
    published: true,
    featured: true,
    coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80'
  },
  {
    title: 'MongoDB Aggregation Pipeline Tutorial',
    content: '# MongoDB Aggregation Pipeline\n\nThe aggregation pipeline transforms documents through stages.\n\n```javascript\ndb.orders.aggregate([\n  { $match: { status: "completed" } },\n  { $group: { _id: "$customer", total: { $sum: "$amount" } } },\n  { $sort: { total: -1 } },\n  { $limit: 10 }\n]);\n```\n\n## Common Stages\n- **$match** - Filter documents\n- **$group** - Group and aggregate\n- **$sort** - Sort documents\n- **$project** - Select/transform fields\n- **$lookup** - Join collections',
    excerpt: 'Learn MongoDB aggregation pipeline with practical examples for data transformation.',
    category: 'MongoDB',
    difficulty: 'Intermediate',
    author: { name: 'Mohit Decodes', avatar: 'https://ui-avatars.com/api/?background=7c3aed&color=fff&name=Mohit' },
    tags: ['mongodb', 'aggregation', 'database'],
    published: true,
    coverImage: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&q=80'
  },
  {
    title: 'JWT Authentication in Node.js',
    content: '# JWT Authentication\n\nJSON Web Tokens provide stateless authentication.\n\n```javascript\nconst jwt = require("jsonwebtoken");\n\n// Generate token\nconst token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });\n\n// Verify token\nconst decoded = jwt.verify(token, process.env.JWT_SECRET);\n```\n\n## Token Structure\n- **Header** - Algorithm type\n- **Payload** - Claims/data\n- **Signature** - Verification\n\nStore tokens in HTTP-only cookies for security.',
    excerpt: 'Implement secure JWT authentication in Node.js Express applications.',
    category: 'Node.js',
    difficulty: 'Intermediate',
    author: { name: 'Mohit Decodes', avatar: 'https://ui-avatars.com/api/?background=7c3aed&color=fff&name=Mohit' },
    tags: ['jwt', 'authentication', 'nodejs', 'security'],
    published: true,
    coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80'
  },
  {
    title: 'CSS Flexbox Complete Guide',
    content: '# CSS Flexbox Guide\n\nFlexbox makes layout design intuitive and responsive.\n\n```css\n.container {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  gap: 1rem;\n}\n\n.item {\n  flex: 1;\n}\n```\n\n## Key Properties\n- `justify-content` - Main axis alignment\n- `align-items` - Cross axis alignment\n- `flex-wrap` - Wrap items\n- `gap` - Space between items',
    excerpt: 'Master CSS Flexbox for building modern, responsive layouts.',
    category: 'Frontend',
    difficulty: 'Beginner',
    author: { name: 'Mohit Decodes', avatar: 'https://ui-avatars.com/api/?background=7c3aed&color=fff&name=Mohit' },
    tags: ['css', 'flexbox', 'responsive', 'layout'],
    published: true,
    coverImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80'
  },
  {
    title: 'TypeScript Interfaces vs Types',
    content: '# TypeScript: Interfaces vs Types\n\n```typescript\n// Interface\ninterface User {\n  name: string;\n  email: string;\n  age?: number;\n}\n\n// Type Alias\ntype Product = {\n  id: number;\n  title: string;\n  price: number;\n};\n\n// Extending\ninterface Admin extends User {\n  role: "admin";\n}\n\ntype AdminType = User & { role: "admin" };\n```\n\n## When to Use Which?\n- **Interfaces**: For object shapes and OOP patterns\n- **Types**: For unions, intersections, primitives',
    excerpt: 'Understand when to use interfaces vs type aliases in TypeScript.',
    category: 'Frontend',
    difficulty: 'Intermediate',
    author: { name: 'Mohit Decodes', avatar: 'https://ui-avatars.com/api/?background=7c3aed&color=fff&name=Mohit' },
    tags: ['typescript', 'interfaces', 'types', 'frontend'],
    published: true,
    coverImage: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=800&q=80'
  },
  {
    title: 'Tailwind CSS Quick Reference',
    content: '# Tailwind CSS Reference\n\n```html\n<!-- Responsive Flexbox Card -->\n<div class="flex flex-col md:flex-row gap-4 p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">\n  <img class="w-full md:w-48 rounded-lg object-cover" src="..." alt="...">\n  <div class="flex flex-col justify-between">\n    <h2 class="text-xl font-bold text-gray-900">Title</h2>\n    <p class="text-gray-600 text-sm">Description</p>\n    <button class="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">Action</button>\n  </div>\n</div>\n```',
    excerpt: 'Quick reference for Tailwind CSS utility classes and patterns.',
    category: 'Frontend',
    difficulty: 'Beginner',
    author: { name: 'Mohit Decodes', avatar: 'https://ui-avatars.com/api/?background=7c3aed&color=fff&name=Mohit' },
    tags: ['tailwind', 'css', 'utility', 'responsive'],
    published: true,
    coverImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80'
  },
  {
    title: 'Understanding Closures in JavaScript',
    content: '# JavaScript Closures\n\nA closure gives you access to an outer function\'s scope from an inner function.\n\n```javascript\nfunction makeCounter() {\n  let count = 0;\n  return function() {\n    count++;\n    return count;\n  };\n}\n\nconst counter = makeCounter();\nconsole.log(counter()); // 1\nconsole.log(counter()); // 2\nconsole.log(counter()); // 3\n```\n\n## Practical Uses\n- Private variables\n- Factory functions\n- Module pattern\n- Event handlers',
    excerpt: 'Deep dive into JavaScript closures with practical examples and use cases.',
    category: 'JavaScript',
    difficulty: 'Intermediate',
    author: { name: 'Mohit Decodes', avatar: 'https://ui-avatars.com/api/?background=7c3aed&color=fff&name=Mohit' },
    tags: ['javascript', 'closures', 'scope', 'advanced'],
    published: true,
    coverImage: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=800&q=80'
  }
];

const blogs = [
  {
    title: '10 JavaScript Tips Every Developer Should Know in 2024',
    excerpt: 'Boost your JavaScript skills with these 10 practical tips that will make your code cleaner, faster, and more professional.',
    content: '# 10 JavaScript Tips for 2024\n\n## 1. Optional Chaining\n```javascript\nconst city = user?.address?.city ?? "Unknown";\n```\n\n## 2. Nullish Coalescing\n```javascript\nconst name = user.name ?? "Anonymous";\n```\n\n## 3. Array Destructuring\n```javascript\nconst [first, ...rest] = [1, 2, 3, 4, 5];\n```\n\n## 4. Object Shorthand\n```javascript\nconst { name, email } = user;\nconst profile = { name, email };\n```\n\n## 5. Array Methods\n```javascript\nconst doubled = numbers.map(n => n * 2);\nconst evens = numbers.filter(n => n % 2 === 0);\nconst sum = numbers.reduce((acc, n) => acc + n, 0);\n```',
    coverImage: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=1200&q=80',
    author: { name: 'Mohit Decodes', avatar: 'https://ui-avatars.com/api/?background=7c3aed&color=fff&name=Mohit', bio: 'Full Stack Developer' },
    category: 'JavaScript',
    tags: ['javascript', 'tips', 'programming', 'es6'],
    published: true,
    featured: true,
    views: 15420
  },
  {
    title: 'Why I Switched from CRA to Vite (And You Should Too)',
    excerpt: 'Create React App is slow. Vite is blazingly fast. Here\'s why you should make the switch today.',
    content: '# CRA vs Vite: The Switch Worth Making\n\nAfter years of using Create React App, I finally made the switch to Vite. Here\'s what I discovered.\n\n## The Problem with CRA\n- Slow cold starts (30+ seconds for large projects)\n- Slow HMR\n- Outdated webpack configuration\n- No ESM support by default\n\n## Why Vite is Better\n```bash\n# CRA start time: ~30s\n# Vite start time: ~300ms\n```\n\nVite leverages native ES modules in the browser, serving files on-demand instead of bundling everything upfront.',
    coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&q=80',
    author: { name: 'Mohit Decodes', avatar: 'https://ui-avatars.com/api/?background=7c3aed&color=fff&name=Mohit', bio: 'Frontend Developer' },
    category: 'React',
    tags: ['vite', 'react', 'tooling', 'frontend'],
    published: true,
    views: 8930,
    featured: true
  },
  {
    title: 'The Complete MERN Stack Guide for Beginners',
    excerpt: 'Everything you need to know to start building full-stack web applications with MongoDB, Express, React, and Node.js.',
    content: '# MERN Stack Complete Guide\n\nMERN stack is the most popular full-stack JavaScript framework.\n\n## What is MERN?\n- **M**ongoDB - Database\n- **E**xpress.js - Backend framework\n- **R**eact.js - Frontend library\n- **N**ode.js - Runtime environment\n\n## Project Structure\n```\nmern-project/\n├── client/     # React frontend\n└── server/     # Express backend\n```',
    coverImage: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=1200&q=80',
    author: { name: 'Mohit Decodes', avatar: 'https://ui-avatars.com/api/?background=7c3aed&color=fff&name=Mohit', bio: 'Full Stack Developer' },
    category: 'Full Stack',
    tags: ['mern', 'fullstack', 'beginners', 'webdev'],
    published: true,
    views: 22100,
    featured: true
  },
  {
    title: 'How to Prepare for Frontend Developer Interviews in 2024',
    excerpt: 'A comprehensive guide to acing frontend developer interviews with tips on DSA, system design, and React.',
    content: '# Frontend Interview Prep Guide\n\n## What to Expect\n1. JavaScript fundamentals\n2. React concepts\n3. CSS/HTML\n4. DSA basics\n5. System design (for senior roles)\n\n## Key JavaScript Topics\n- Closures\n- Prototypes\n- Event loop\n- Promises/async\n- THIS keyword\n\n## React Interview Questions\n- Reconciliation\n- Virtual DOM\n- Hooks\n- Performance optimization\n- State management',
    coverImage: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=1200&q=80',
    author: { name: 'Mohit Decodes', avatar: 'https://ui-avatars.com/api/?background=7c3aed&color=fff&name=Mohit', bio: 'Senior Developer' },
    category: 'Career',
    tags: ['interview', 'frontend', 'career', 'javascript'],
    published: true,
    views: 18760
  },
  {
    title: 'CSS Grid vs Flexbox: When to Use Which',
    excerpt: 'Clear the confusion once and for all. Learn when CSS Grid is the right choice vs Flexbox.',
    content: '# CSS Grid vs Flexbox\n\n## Flexbox - 1D Layout\nUse for rows OR columns:\n```css\n.nav { display: flex; justify-content: space-between; }\n.card-content { display: flex; flex-direction: column; }\n```\n\n## Grid - 2D Layout\nUse for rows AND columns:\n```css\n.page-layout {\n  display: grid;\n  grid-template-columns: 250px 1fr;\n  grid-template-rows: auto 1fr auto;\n}\n```',
    coverImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=80',
    author: { name: 'Mohit Decodes', avatar: 'https://ui-avatars.com/api/?background=7c3aed&color=fff&name=Mohit', bio: 'CSS Enthusiast' },
    category: 'Frontend',
    tags: ['css', 'grid', 'flexbox', 'layout'],
    published: true,
    views: 11230
  },
  {
    title: 'Building Secure Node.js APIs: Best Practices',
    excerpt: 'Security is not optional. Learn essential security practices for building production-ready Node.js APIs.',
    content: '# Secure Node.js APIs\n\n## Essential Security Packages\n```bash\nnpm install helmet cors express-rate-limit express-mongo-sanitize\n```\n\n## Implementation\n```javascript\napp.use(helmet());\napp.use(cors({ origin: process.env.CLIENT_URL }));\napp.use(rateLimit({ windowMs: 15*60*1000, max: 100 }));\napp.use(mongoSanitize());\n```\n\n## Never Do\n- Store secrets in code\n- Trust client input\n- Use HTTP in production\n- Expose stack traces to users',
    coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&q=80',
    author: { name: 'Mohit Decodes', avatar: 'https://ui-avatars.com/api/?background=7c3aed&color=fff&name=Mohit', bio: 'Backend Engineer' },
    category: 'Node.js',
    tags: ['nodejs', 'security', 'backend', 'api'],
    published: true,
    views: 9870
  },
  {
    title: 'State Management in React: Context API vs Redux',
    excerpt: 'Should you use Context API or Redux for state management? Here\'s a clear breakdown.',
    content: '# Context API vs Redux\n\n## Context API\nBest for: Theme, user auth, simple global state\n```jsx\nconst ThemeContext = createContext();\n\nexport function ThemeProvider({ children }) {\n  const [theme, setTheme] = useState("dark");\n  return (\n    <ThemeContext.Provider value={{ theme, setTheme }}>\n      {children}\n    </ThemeContext.Provider>\n  );\n}\n```\n\n## Redux Toolkit\nBest for: Complex state, large apps\n```javascript\nconst counterSlice = createSlice({\n  name: "counter",\n  initialState: { value: 0 },\n  reducers: {\n    increment: state => { state.value += 1; }\n  }\n});\n```',
    coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&q=80',
    author: { name: 'Mohit Decodes', avatar: 'https://ui-avatars.com/api/?background=7c3aed&color=fff&name=Mohit', bio: 'React Developer' },
    category: 'React',
    tags: ['react', 'redux', 'context', 'state management'],
    published: true,
    views: 13450
  },
  {
    title: 'Roadmap to Becoming a Full Stack Developer in 2024',
    excerpt: 'The definitive roadmap for becoming a full stack developer — what to learn and in what order.',
    content: '# Full Stack Developer Roadmap 2024\n\n## Phase 1: Frontend (3-4 months)\n- HTML & CSS basics\n- JavaScript fundamentals\n- React.js\n- Responsive design\n\n## Phase 2: Backend (2-3 months)\n- Node.js\n- Express.js\n- REST APIs\n- Authentication\n\n## Phase 3: Database (1-2 months)\n- MongoDB\n- SQL basics\n- Database design\n\n## Phase 4: DevOps (1 month)\n- Git/GitHub\n- Deployment (Vercel, Railway)\n- CI/CD basics',
    coverImage: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=1200&q=80',
    author: { name: 'Mohit Decodes', avatar: 'https://ui-avatars.com/api/?background=7c3aed&color=fff&name=Mohit', bio: 'Tech Educator' },
    category: 'Career',
    tags: ['roadmap', 'fullstack', 'career', 'webdev'],
    published: true,
    views: 28900,
    featured: true
  }
];

const resources = [
  {
    title: 'JavaScript ES6+ Cheat Sheet',
    description: 'Complete reference for ES6+ JavaScript features including arrow functions, destructuring, spread operator, promises, async/await, and more.',
    category: 'Cheat Sheet',
    fileUrl: 'https://example.com/resources/js-es6-cheatsheet.pdf',
    fileType: 'PDF',
    fileSize: '2.4 MB',
    downloads: 12450,
    tags: ['javascript', 'es6', 'cheatsheet'],
    isPublished: true,
    featured: true
  },
  {
    title: 'React Hooks Complete Reference',
    description: 'All React hooks explained with examples — useState, useEffect, useContext, useRef, useMemo, useCallback and more.',
    category: 'Cheat Sheet',
    fileUrl: 'https://example.com/resources/react-hooks-reference.pdf',
    fileType: 'PDF',
    fileSize: '1.8 MB',
    downloads: 9870,
    tags: ['react', 'hooks', 'reference'],
    isPublished: true,
    featured: true
  },
  {
    title: 'Top 50 JavaScript Interview Questions',
    description: '50 most asked JavaScript interview questions with detailed answers. Covers closures, hoisting, prototype, event loop, and more.',
    category: 'Interview Questions',
    fileUrl: 'https://example.com/resources/js-interview-questions.pdf',
    fileType: 'PDF',
    fileSize: '3.2 MB',
    downloads: 18900,
    tags: ['javascript', 'interview', 'questions'],
    isPublished: true,
    featured: true
  },
  {
    title: 'MERN Stack Complete Notes',
    description: 'Comprehensive notes for MERN stack development including MongoDB, Express, React, and Node.js with practical examples.',
    category: 'Notes',
    fileUrl: 'https://example.com/resources/mern-complete-notes.pdf',
    fileType: 'PDF',
    fileSize: '8.5 MB',
    downloads: 7650,
    tags: ['mern', 'fullstack', 'notes'],
    isPublished: true
  },
  {
    title: 'CSS Flexbox & Grid Cheat Sheet',
    description: 'Visual cheat sheet for CSS Flexbox and Grid layout properties with examples and browser compatibility notes.',
    category: 'Cheat Sheet',
    fileUrl: 'https://example.com/resources/css-layout-cheatsheet.pdf',
    fileType: 'PDF',
    fileSize: '1.2 MB',
    downloads: 14230,
    tags: ['css', 'flexbox', 'grid', 'cheatsheet'],
    isPublished: true
  },
  {
    title: 'DSA Interview Preparation Kit',
    description: '100+ coding problems categorized by topic — Arrays, Strings, Trees, Graphs, DP with solutions in JavaScript.',
    category: 'Coding Problems',
    fileUrl: 'https://example.com/resources/dsa-prep-kit.pdf',
    fileType: 'PDF',
    fileSize: '12 MB',
    downloads: 22100,
    tags: ['dsa', 'algorithms', 'interview', 'problems'],
    isPublished: true,
    featured: true
  },
  {
    title: 'Git Commands Reference Card',
    description: 'Quick reference for all essential Git commands — init, clone, commit, push, pull, branch, merge, rebase, and more.',
    category: 'Cheat Sheet',
    fileUrl: 'https://example.com/resources/git-commands.pdf',
    fileType: 'PDF',
    fileSize: '0.9 MB',
    downloads: 16540,
    tags: ['git', 'github', 'commands'],
    isPublished: true
  },
  {
    title: 'Full Stack Developer Resume Template',
    description: 'ATS-optimized resume template for full-stack developers with tips on what to include and what to avoid.',
    category: 'Template',
    fileUrl: 'https://example.com/resources/fullstack-resume-template.docx',
    fileType: 'DOCX',
    fileSize: '0.5 MB',
    downloads: 8920,
    tags: ['resume', 'career', 'template'],
    isPublished: true
  }
];

const projects = [
  {
    title: 'Task Management App',
    description: 'A full-stack task management application with drag-and-drop, user authentication, real-time updates, and team collaboration features.',
    longDescription: 'Built with React, Node.js, Express, and MongoDB. Features include kanban board, drag-and-drop, JWT auth, team workspaces.',
    image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80',
    technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Socket.io'],
    githubUrl: 'https://github.com/mohitdecodes/task-manager',
    liveUrl: 'https://taskmanager-demo.vercel.app',
    difficulty: 'Intermediate',
    category: 'Full Stack',
    featured: true,
    tags: ['fullstack', 'react', 'nodejs', 'mongodb']
  },
  {
    title: 'E-Commerce Platform',
    description: 'Complete e-commerce platform with product management, cart, payment integration, order tracking, and admin dashboard.',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80',
    technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Stripe', 'Tailwind CSS'],
    githubUrl: 'https://github.com/mohitdecodes/ecommerce',
    liveUrl: 'https://ecommerce-demo.vercel.app',
    difficulty: 'Advanced',
    category: 'Full Stack',
    featured: true,
    tags: ['ecommerce', 'fullstack', 'payment', 'admin']
  },
  {
    title: 'Real-Time Chat Application',
    description: 'WhatsApp-inspired chat app with real-time messaging, group chats, file sharing, and online status indicators.',
    image: 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=800&q=80',
    technologies: ['React', 'Node.js', 'Socket.io', 'MongoDB', 'JWT'],
    githubUrl: 'https://github.com/mohitdecodes/chat-app',
    liveUrl: 'https://chat-demo.vercel.app',
    difficulty: 'Advanced',
    category: 'Full Stack',
    featured: true,
    tags: ['chat', 'websocket', 'realtime', 'fullstack']
  },
  {
    title: 'Blog CMS Platform',
    description: 'Full-featured blog CMS with markdown editor, SEO optimization, comment system, and analytics dashboard.',
    image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80',
    technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Markdown'],
    githubUrl: 'https://github.com/mohitdecodes/blog-cms',
    liveUrl: 'https://blog-demo.vercel.app',
    difficulty: 'Intermediate',
    category: 'Full Stack',
    tags: ['blog', 'cms', 'markdown', 'fullstack']
  },
  {
    title: 'GitHub Profile Finder',
    description: 'Search any GitHub user and view their repositories, followers, following, and contribution stats.',
    image: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=800&q=80',
    technologies: ['React', 'GitHub API', 'Tailwind CSS', 'Axios'],
    githubUrl: 'https://github.com/mohitdecodes/github-finder',
    liveUrl: 'https://github-finder-demo.vercel.app',
    difficulty: 'Beginner',
    category: 'Frontend',
    tags: ['api', 'github', 'react', 'beginner']
  },
  {
    title: 'Weather Dashboard',
    description: 'Beautiful weather app with 7-day forecast, location search, weather maps, and local storage for saved locations.',
    image: 'https://images.unsplash.com/photo-1504608524841-42584120d693?w=800&q=80',
    technologies: ['React', 'OpenWeather API', 'Chart.js', 'Geolocation API'],
    githubUrl: 'https://github.com/mohitdecodes/weather-app',
    liveUrl: 'https://weather-demo.vercel.app',
    difficulty: 'Beginner',
    category: 'Frontend',
    tags: ['weather', 'api', 'react', 'charts']
  },
  {
    title: 'Social Media Dashboard',
    description: 'Analytics dashboard for social media metrics with charts, graphs, dark mode, and responsive design.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    technologies: ['React', 'Chart.js', 'Tailwind CSS', 'Framer Motion'],
    githubUrl: 'https://github.com/mohitdecodes/social-dashboard',
    liveUrl: 'https://dashboard-demo.vercel.app',
    difficulty: 'Intermediate',
    category: 'Frontend',
    featured: true,
    tags: ['dashboard', 'charts', 'analytics', 'react']
  },
  {
    title: 'URL Shortener',
    description: 'Full-stack URL shortener with custom aliases, click analytics, QR code generation, and API access.',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    technologies: ['Node.js', 'Express', 'MongoDB', 'React', 'QR Code API'],
    githubUrl: 'https://github.com/mohitdecodes/url-shortener',
    liveUrl: 'https://shorturl-demo.vercel.app',
    difficulty: 'Beginner',
    category: 'Full Stack',
    tags: ['url', 'backend', 'api', 'fullstack']
  }
];

const roadmaps = [
  {
    title: 'Frontend Developer Roadmap',
    description: 'Complete path to becoming a professional frontend developer — from HTML basics to advanced React and performance optimization.',
    category: 'Frontend',
    difficulty: 'Beginner',
    estimatedDuration: '4-5 months',
    isPublished: true,
    featured: true,
    color: '#3b82f6',
    steps: [
      { title: 'HTML Fundamentals', description: 'Learn HTML tags, semantic elements, forms, and document structure.', order: 1, resources: [{ title: 'MDN HTML Guide', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML', type: 'documentation' }] },
      { title: 'CSS Basics', description: 'Box model, selectors, colors, typography, and basic layouts.', order: 2, resources: [{ title: 'CSS Tutorial', url: 'https://www.w3schools.com/css/', type: 'article' }] },
      { title: 'CSS Flexbox & Grid', description: 'Modern CSS layout techniques for responsive designs.', order: 3 },
      { title: 'Responsive Design', description: 'Media queries, mobile-first approach, viewport units.', order: 4 },
      { title: 'JavaScript Basics', description: 'Variables, functions, loops, arrays, objects, DOM manipulation.', order: 5 },
      { title: 'JavaScript ES6+', description: 'Arrow functions, destructuring, modules, promises, async/await.', order: 6 },
      { title: 'Version Control - Git', description: 'Git commands, GitHub, branching, pull requests.', order: 7 },
      { title: 'React.js Fundamentals', description: 'Components, props, state, hooks, React Router.', order: 8 },
      { title: 'State Management', description: 'Context API, Redux Toolkit for complex state.', order: 9 },
      { title: 'Build Tools', description: 'Vite, Webpack basics, npm/yarn, environment variables.', order: 10 },
      { title: 'Testing', description: 'Jest, React Testing Library, unit and integration tests.', order: 11 },
      { title: 'Performance & Optimization', description: 'Lazy loading, code splitting, memoization, Lighthouse.', order: 12 }
    ]
  },
  {
    title: 'Backend Developer Roadmap',
    description: 'From Node.js basics to building production APIs with authentication, databases, caching, and deployment.',
    category: 'Backend',
    difficulty: 'Intermediate',
    estimatedDuration: '3-4 months',
    isPublished: true,
    featured: true,
    color: '#10b981',
    steps: [
      { title: 'Node.js Basics', description: 'Understanding Node.js runtime, event loop, and core modules.', order: 1 },
      { title: 'Express.js', description: 'Building web servers, middleware, routing, error handling.', order: 2 },
      { title: 'REST API Design', description: 'RESTful principles, HTTP methods, status codes, documentation.', order: 3 },
      { title: 'MongoDB & Mongoose', description: 'NoSQL database, CRUD operations, schemas, aggregation.', order: 4 },
      { title: 'Authentication & Security', description: 'JWT, bcrypt, helmet, rate limiting, CORS.', order: 5 },
      { title: 'File Uploads', description: 'Multer, Cloudinary integration, S3 storage.', order: 6 },
      { title: 'Email Service', description: 'Nodemailer, email templates, transactional emails.', order: 7 },
      { title: 'Caching', description: 'Redis basics, response caching, session storage.', order: 8 },
      { title: 'Deployment', description: 'Railway, Render, AWS EC2, environment management.', order: 9 }
    ]
  },
  {
    title: 'MERN Stack Developer Roadmap',
    description: 'Complete MERN stack roadmap combining frontend and backend skills to build full production applications.',
    category: 'Full Stack',
    difficulty: 'Intermediate',
    estimatedDuration: '6-8 months',
    isPublished: true,
    featured: true,
    color: '#7c3aed',
    steps: [
      { title: 'HTML & CSS Foundations', description: 'Web fundamentals — structure and styling.', order: 1 },
      { title: 'JavaScript Mastery', description: 'Core JS concepts that power both React and Node.', order: 2 },
      { title: 'React.js', description: 'Build dynamic UIs with components and hooks.', order: 3 },
      { title: 'Node.js & Express', description: 'Build backend server and REST APIs.', order: 4 },
      { title: 'MongoDB & Mongoose', description: 'NoSQL database for your Node.js backend.', order: 5 },
      { title: 'Authentication', description: 'JWT auth, protected routes, role-based access.', order: 6 },
      { title: 'Connecting Frontend & Backend', description: 'Axios, API integration, CORS setup.', order: 7 },
      { title: 'State Management', description: 'Context API or Redux for global state.', order: 8 },
      { title: 'Building Full Projects', description: 'Create 2-3 complete MERN projects.', order: 9 },
      { title: 'Deployment', description: 'Deploy frontend (Vercel) and backend (Railway/Render).', order: 10 }
    ]
  },
  {
    title: 'DSA with JavaScript',
    description: 'Master Data Structures and Algorithms for coding interviews — from arrays to dynamic programming.',
    category: 'DSA',
    difficulty: 'Intermediate',
    estimatedDuration: '3-4 months',
    isPublished: true,
    color: '#f59e0b',
    steps: [
      { title: 'Big O Notation', description: 'Time and space complexity analysis.', order: 1 },
      { title: 'Arrays & Strings', description: 'Traversal, two pointers, sliding window.', order: 2 },
      { title: 'Recursion', description: 'Base cases, call stack, backtracking basics.', order: 3 },
      { title: 'Sorting Algorithms', description: 'Bubble, selection, insertion, merge, quick sort.', order: 4 },
      { title: 'Linked Lists', description: 'Singly, doubly linked, common operations.', order: 5 },
      { title: 'Stacks & Queues', description: 'Implementation and applications.', order: 6 },
      { title: 'Binary Trees', description: 'Traversals, BST, balanced trees.', order: 7 },
      { title: 'Graphs', description: 'BFS, DFS, shortest path algorithms.', order: 8 },
      { title: 'Dynamic Programming', description: 'Memoization, tabulation, classic DP problems.', order: 9 },
      { title: 'Practice 100 Problems', description: 'LeetCode Easy/Medium problems by topic.', order: 10 }
    ]
  },
  {
    title: 'Full Stack Developer Complete Roadmap',
    description: 'The ultimate roadmap from zero to full-stack developer covering frontend, backend, database, DevOps, and system design.',
    category: 'Full Stack',
    difficulty: 'Advanced',
    estimatedDuration: '10-12 months',
    isPublished: true,
    featured: true,
    color: '#ec4899',
    steps: [
      { title: 'Web Fundamentals', description: 'HTML, CSS, how the web works.', order: 1 },
      { title: 'JavaScript', description: 'ES6+, DOM, async programming.', order: 2 },
      { title: 'React.js Frontend', description: 'Modern React with hooks and routing.', order: 3 },
      { title: 'TypeScript', description: 'Type-safe JavaScript for large applications.', order: 4 },
      { title: 'Node.js Backend', description: 'Server-side JavaScript with Node.', order: 5 },
      { title: 'Databases', description: 'MongoDB, SQL basics, Redis.', order: 6 },
      { title: 'Authentication & Security', description: 'JWT, OAuth, web security.', order: 7 },
      { title: 'DevOps Basics', description: 'Docker, CI/CD, cloud deployment.', order: 8 },
      { title: 'System Design', description: 'Scalability, load balancing, caching.', order: 9 },
      { title: 'DSA for Interviews', description: 'Essential algorithms and data structures.', order: 10 }
    ]
  }
];

const testimonials = [
  {
    name: 'Arjun Mehta',
    avatar: 'https://ui-avatars.com/api/?background=3b82f6&color=fff&name=Arjun+Mehta&size=200',
    role: 'Frontend Developer at Infosys',
    company: 'Infosys',
    rating: 5,
    message: 'MohitDecodes completely transformed my career. The MERN stack course was so practical and hands-on that I landed my first developer job within 3 months of completing it. The content quality is unmatched!',
    approved: true,
    featured: true
  },
  {
    name: 'Sneha Kapoor',
    avatar: 'https://ui-avatars.com/api/?background=ec4899&color=fff&name=Sneha+Kapoor&size=200',
    role: 'Full Stack Developer at Startup',
    company: 'TechStartup',
    rating: 5,
    message: 'The JavaScript mastery course here is absolutely incredible. I went from knowing nothing about coding to building full-stack applications in 6 months. The explanations are crystal clear and the projects are real-world.',
    approved: true,
    featured: true
  },
  {
    name: 'Vikram Patel',
    avatar: 'https://ui-avatars.com/api/?background=10b981&color=fff&name=Vikram+Patel&size=200',
    role: 'React Developer at MNC',
    company: 'Wipro',
    rating: 5,
    message: 'Best learning platform for MERN stack development. The roadmaps helped me know exactly what to learn next, and the resources saved me hours of searching. Highly recommend to every aspiring developer!',
    approved: true,
    featured: true
  },
  {
    name: 'Ananya Sharma',
    avatar: 'https://ui-avatars.com/api/?background=f59e0b&color=fff&name=Ananya+Sharma&size=200',
    role: 'Software Engineer at TCS',
    company: 'TCS',
    rating: 5,
    message: 'The DSA course and interview prep resources helped me crack my TCS interview. The problems are well-organized and the solutions explained beautifully. This platform is a gem for job seekers!',
    approved: true
  },
  {
    name: 'Rohan Kumar',
    avatar: 'https://ui-avatars.com/api/?background=7c3aed&color=fff&name=Rohan+Kumar&size=200',
    role: 'Backend Developer',
    company: 'Freelancer',
    rating: 5,
    message: 'As a computer science student, I was confused about where to start. MohitDecodes roadmaps gave me a clear path. The Node.js and MongoDB courses are the best I\'ve found online — practical, concise, and up-to-date.',
    approved: true,
    featured: true
  },
  {
    name: 'Pooja Nair',
    avatar: 'https://ui-avatars.com/api/?background=ef4444&color=fff&name=Pooja+Nair&size=200',
    role: 'Junior Developer at Accenture',
    company: 'Accenture',
    rating: 5,
    message: 'Free resources here are better than paid courses elsewhere! Downloaded the JavaScript cheat sheet and interview questions — they were incredibly helpful. Now I use this platform as my primary learning resource.',
    approved: true
  }
];

// ============ SEED FUNCTION ============

const seedDB = async () => {
  try {
    await connectDB();

    console.log('🗑️  Clearing existing data...');
    await Promise.all([
      User.deleteMany({}),
      Course.deleteMany({}),
      Tutorial.deleteMany({}),
      Blog.deleteMany({}),
      Resource.deleteMany({}),
      Project.deleteMany({}),
      Roadmap.deleteMany({}),
      Testimonial.deleteMany({}),
      Newsletter.deleteMany({})
    ]);

    console.log('🌱 Seeding users...');
    const createdUsers = await User.create(users);
    console.log(`✅ ${createdUsers.length} users created`);

    console.log('🌱 Seeding courses...');
    const createdCourses = await Course.create(courses);
    console.log(`✅ ${createdCourses.length} courses created`);

    console.log('🌱 Seeding tutorials...');
    const createdTutorials = await Tutorial.create(tutorials);
    console.log(`✅ ${createdTutorials.length} tutorials created`);

    console.log('🌱 Seeding blogs...');
    const createdBlogs = await Blog.create(blogs);
    console.log(`✅ ${createdBlogs.length} blogs created`);

    console.log('🌱 Seeding resources...');
    const createdResources = await Resource.create(resources);
    console.log(`✅ ${createdResources.length} resources created`);

    console.log('🌱 Seeding projects...');
    const createdProjects = await Project.create(projects);
    console.log(`✅ ${createdProjects.length} projects created`);

    console.log('🌱 Seeding roadmaps...');
    const createdRoadmaps = await Roadmap.create(roadmaps);
    console.log(`✅ ${createdRoadmaps.length} roadmaps created`);

    console.log('🌱 Seeding testimonials...');
    const createdTestimonials = await Testimonial.create(testimonials);
    console.log(`✅ ${createdTestimonials.length} testimonials created`);

    console.log('');
    console.log('🎉 Database seeded successfully!');
    console.log('');
    console.log('📋 Admin Credentials:');
    console.log(`   Email: ${process.env.ADMIN_EMAIL || 'admin@mohitdecodes.com'}`);
    console.log(`   Password: ${process.env.ADMIN_PASSWORD || 'Admin@123456'}`);
    console.log('');
    console.log('🚀 Start server: npm run dev');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err.message);
    process.exit(1);
  }
};

seedDB();
