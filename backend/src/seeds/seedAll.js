require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const GovernmentJob = require('../models/GovernmentJob');
const Result = require('../models/Result');
const Scholarship = require('../models/Scholarship');
const VillageScheme = require('../models/VillageScheme');

// ─── SEED DATA ────────────────────────────────────────────

const jobsData = [
  {
    title: 'Bihar Police Constable Recruitment 2026',
    organization: 'Bihar Police',
    posts: '5000 Posts',
    lastDate: '15 May 2026',
    location: 'Bihar',
    category: 'Police',
    salary: '₹21,700 - ₹69,100',
    qualification: '12th Pass',
    applyLink: '#',
    isNewPost: true,
    isActive: true,
  },
  {
    title: 'Railway Group D Recruitment 2026',
    organization: 'Railway Recruitment Board',
    posts: '62,907 Posts',
    lastDate: '20 May 2026',
    location: 'All India',
    category: 'Railway',
    salary: '₹18,000 - ₹56,900',
    qualification: '10th Pass',
    applyLink: '#',
    isNewPost: true,
    isActive: true,
  },
  {
    title: 'SSC CGL 2026 Combined Graduate Level Exam',
    organization: 'Staff Selection Commission',
    posts: '10,000+ Posts',
    lastDate: '30 May 2026',
    location: 'All India',
    category: 'SSC',
    salary: '₹44,900 - ₹1,42,400',
    qualification: 'Graduation',
    applyLink: '#',
    isNewPost: false,
    isActive: true,
  },
  {
    title: 'IBPS PO Recruitment 2026',
    organization: 'Institute of Banking Personnel Selection',
    posts: '4,000 Posts',
    lastDate: '10 Jun 2026',
    location: 'All India',
    category: 'Bank',
    salary: '₹53,000 - ₹79,000',
    qualification: 'Graduation',
    applyLink: '#',
    isNewPost: false,
    isActive: true,
  },
  {
    title: 'Indian Army Agniveer Recruitment 2026',
    organization: 'Indian Army',
    posts: '40,000 Posts',
    lastDate: '25 May 2026',
    location: 'All India',
    category: 'Defence',
    salary: '₹30,000 per month',
    qualification: '10th/12th Pass',
    applyLink: '#',
    isNewPost: true,
    isActive: true,
  },
  {
    title: 'Bihar BPSC 69th Combined Preliminary Exam',
    organization: 'Bihar Public Service Commission',
    posts: '597 Posts',
    lastDate: '5 Jun 2026',
    location: 'Bihar',
    category: 'State Govt',
    salary: '₹44,900 - ₹1,42,400',
    qualification: 'Graduation',
    applyLink: '#',
    isNewPost: false,
    isActive: true,
  },
];

const resultsData = [
  {
    title: 'Bihar Board 12th Result 2026',
    organization: 'Bihar School Examination Board',
    date: '28 Apr 2026',
    status: 'Declared',
    category: 'Board',
    resultLink: '#',
    downloadLink: '#',
    isNewPost: true,
    isActive: true,
  },
  {
    title: 'NEET UG Result 2026',
    organization: 'National Testing Agency',
    date: '25 Apr 2026',
    status: 'Declared',
    category: 'Entrance',
    resultLink: '#',
    downloadLink: '#',
    isNewPost: true,
    isActive: true,
  },
  {
    title: 'SSC CGL Tier 1 Result 2026',
    organization: 'Staff Selection Commission',
    date: '20 Apr 2026',
    status: 'Declared',
    category: 'Govt Exam',
    resultLink: '#',
    downloadLink: '#',
    isNewPost: false,
    isActive: true,
  },
  {
    title: 'Bihar Police Constable Result 2026',
    organization: 'Bihar Police',
    date: '15 Apr 2026',
    status: 'Declared',
    category: 'Police',
    resultLink: '#',
    downloadLink: '#',
    isNewPost: false,
    isActive: true,
  },
  {
    title: 'JEE Main Result 2026 Session 1',
    organization: 'National Testing Agency',
    date: '10 Apr 2026',
    status: 'Declared',
    category: 'Entrance',
    resultLink: '#',
    downloadLink: '#',
    isNewPost: false,
    isActive: true,
  },
  {
    title: 'Railway Group D Result 2026',
    organization: 'Railway Recruitment Board',
    date: 'Expected Soon',
    status: 'Awaited',
    category: 'Railway',
    resultLink: '#',
    downloadLink: '#',
    isNewPost: false,
    isActive: true,
  },
];

const scholarshipsData = [
  {
    title: 'Post Matric Scholarship for SC/ST Students',
    amount: '₹10,000 - ₹20,000',
    eligibility: '10th Pass, SC/ST Category',
    deadline: '30 May 2026',
    provider: 'Bihar Government',
    applicants: '50,000+',
    applyLink: '#',
    isNewPost: true,
    isActive: true,
  },
  {
    title: 'Mukhyamantri Balika Protsahan Yojana',
    amount: '₹25,000',
    eligibility: '12th Pass with 1st Division',
    deadline: '15 Jun 2026',
    provider: 'Bihar Government',
    applicants: '30,000+',
    applyLink: '#',
    isNewPost: true,
    isActive: true,
  },
  {
    title: 'National Scholarship Portal (NSP) 2026',
    amount: '₹5,000 - ₹50,000',
    eligibility: 'Various Categories',
    deadline: '31 May 2026',
    provider: 'Government of India',
    applicants: '1,00,000+',
    applyLink: '#',
    isNewPost: false,
    isActive: true,
  },
  {
    title: 'Pre-Matric Scholarship for Minorities',
    amount: '₹3,000 - ₹5,000',
    eligibility: 'Class 1-10, Minority Community',
    deadline: '20 May 2026',
    provider: 'Ministry of Minority Affairs',
    applicants: '75,000+',
    applyLink: '#',
    isNewPost: false,
    isActive: true,
  },
  {
    title: 'Merit-cum-Means Scholarship',
    amount: '₹20,000 - ₹1,00,000',
    eligibility: 'Graduation/Post Graduation',
    deadline: '10 Jun 2026',
    provider: 'UGC',
    applicants: '25,000+',
    applyLink: '#',
    isNewPost: true,
    isActive: true,
  },
  {
    title: 'Kanya Utthan Yojana Bihar',
    amount: '₹54,100',
    eligibility: 'Graduation Pass Girls',
    deadline: '25 May 2026',
    provider: 'Bihar Government',
    applicants: '40,000+',
    applyLink: '#',
    isNewPost: false,
    isActive: true,
  },
];

const schemesData = [
  {
    title: 'PM Awas Yojana (Gramin)',
    description: 'Financial assistance for building pucca houses in rural areas',
    benefit: '₹1.2 Lakh to ₹1.3 Lakh',
    eligibility: 'BPL families without pucca house',
    category: 'Housing',
    applyLink: '#',
    isActive: true,
  },
  {
    title: 'Ayushman Bharat Yojana',
    description: 'Free health insurance coverage up to ₹5 lakh per family',
    benefit: '₹5 Lakh Health Cover',
    eligibility: 'Economically weaker sections',
    category: 'Health',
    applyLink: '#',
    isActive: true,
  },
  {
    title: 'Public Distribution System (PDS)',
    description: 'Subsidized food grains through ration card',
    benefit: '₹1-3 per kg rice/wheat',
    eligibility: 'BPL & AAY cardholders',
    category: 'Food',
    applyLink: '#',
    isActive: true,
  },
  {
    title: 'Pradhan Mantri Ujjwala Yojana',
    description: 'Free LPG connection to BPL households',
    benefit: 'Free LPG Connection',
    eligibility: 'BPL women',
    category: 'Energy',
    applyLink: '#',
    isActive: true,
  },
  {
    title: 'National Social Assistance Programme',
    description: 'Pension for old age, widow and disabled persons',
    benefit: '₹200 to ₹500 per month',
    eligibility: 'Senior citizens, widows, disabled',
    category: 'Pension',
    applyLink: '#',
    isActive: true,
  },
  {
    title: 'Mahatma Gandhi NREGA',
    description: '100 days guaranteed wage employment',
    benefit: '₹220 per day (Bihar)',
    eligibility: 'Rural households',
    category: 'Employment',
    applyLink: '#',
    isActive: true,
  },
  {
    title: 'Pradhan Mantri Gram Sadak Yojana',
    description: 'All-weather road connectivity to villages',
    benefit: 'Road Infrastructure',
    eligibility: 'Unconnected villages',
    category: 'Infrastructure',
    applyLink: '#',
    isActive: true,
  },
  {
    title: 'Swachh Bharat Mission (Gramin)',
    description: 'Construction of household toilets in rural areas',
    benefit: '₹12,000 for toilet',
    eligibility: 'Households without toilet',
    category: 'Sanitation',
    applyLink: '#',
    isActive: true,
  },
  {
    title: 'PM Kisan Samman Nidhi',
    description: 'Direct income support to farmers',
    benefit: '₹6,000 per year',
    eligibility: 'Small & marginal farmers',
    category: 'Agriculture',
    applyLink: '#',
    isActive: true,
  },
];

// ─── SEED FUNCTION ────────────────────────────────────────

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Admin.deleteMany({});
    await GovernmentJob.deleteMany({});
    await Result.deleteMany({});
    await Scholarship.deleteMany({});
    await VillageScheme.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Seed admin — hash password manually (insertMany bypasses pre-save hook)
    const hashedPassword = await bcrypt.hash('Admin@123', 10);
    await Admin.insertMany([
      { name: 'Super Admin', email: 'admin@villagehelp.in', password: hashedPassword, role: 'admin' },
    ]);
    console.log('👤 Created 1 admin user');
    console.log('   📧 Email: admin@villagehelp.in');
    console.log('   🔑 Password: Admin@123');

    // Seed content
    await GovernmentJob.insertMany(jobsData);
    console.log(`💼 Seeded ${jobsData.length} government jobs`);

    await Result.insertMany(resultsData);
    console.log(`🏆 Seeded ${resultsData.length} results`);

    await Scholarship.insertMany(scholarshipsData);
    console.log(`🎓 Seeded ${scholarshipsData.length} scholarships`);

    await VillageScheme.insertMany(schemesData);
    console.log(`🏘️  Seeded ${schemesData.length} village schemes`);

    console.log('\n✅ Database seeded successfully!');
    console.log('🚀 You can now run: npm run dev');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    await mongoose.connection.close();
    process.exit(1);
  }
};

seedDB();
