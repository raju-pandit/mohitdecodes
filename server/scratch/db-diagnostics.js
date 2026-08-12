const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../models/User');
const Course = require('../models/Course');
const Blog = require('../models/Blog');
const Tutorial = require('../models/Tutorial');
const Resource = require('../models/Resource');
const Project = require('../models/Project');
const Roadmap = require('../models/Roadmap');
const Newsletter = require('../models/Newsletter');
const Contact = require('../models/Contact');

async function runDiagnostics() {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI);
    console.log('Connected!');

    const [
      users, courses, blogs, tutorials, resources, projects, roadmaps, subscribers, contacts
    ] = await Promise.all([
      User.countDocuments(),
      Course.countDocuments(),
      Blog.countDocuments(),
      Tutorial.countDocuments(),
      Resource.countDocuments(),
      Project.countDocuments(),
      Roadmap.countDocuments(),
      Newsletter.countDocuments(),
      Contact.countDocuments()
    ]);

    console.log('\n--- DATABASE STATS ---');
    console.log('Total Users:', users);
    console.log('Total Courses:', courses);
    console.log('Total Blogs:', blogs);
    console.log('Total Tutorials:', tutorials);
    console.log('Total Resources:', resources);
    console.log('Total Projects:', projects);
    console.log('Total Roadmaps:', roadmaps);
    console.log('Total Subscribers:', subscribers);
    console.log('Total Contacts:', contacts);

    console.log('\nSample User:', await User.findOne({}, 'name email role'));

    // Check downloads
    const downloadAgg = await Resource.aggregate([{ $group: { _id: null, total: { $sum: '$downloads' } } }]);
    console.log('Total Downloads:', downloadAgg[0]?.total || 0);

    // Check students
    const studentsAgg = await Course.aggregate([{ $group: { _id: null, total: { $sum: '$students' } } }]);
    console.log('Total Students Enrolled:', studentsAgg[0]?.total || 0);

    await mongoose.disconnect();
    console.log('\nDone.');
  } catch (err) {
    console.error('Error running diagnostics:', err);
  }
}

runDiagnostics();
