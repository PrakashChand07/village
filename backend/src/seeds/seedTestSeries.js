require('dotenv').config();
const mongoose = require('mongoose');
const TestSeries = require('../models/TestSeries');
const Test = require('../models/Test');
const Question = require('../models/Question');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/village');
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

const importData = async () => {
  await connectDB();

  try {
    // Clear old data
    await TestSeries.deleteMany();
    await Test.deleteMany();
    await Question.deleteMany();

    console.log('Old Test Data Cleared...');

    // 1. Create Test Series
    const sscSeries = new TestSeries({
      title: 'SSC CGL Tier 1 Mock Test Series 2026',
      description: 'Comprehensive mock test series for SSC CGL Tier 1 exam preparation. Includes latest pattern questions with detailed explanations.',
      category: 'SSC',
      difficulty: 'Hard',
      price: 499,
      discountPrice: 299,
      isFree: false,
      rating: 4.8,
      studentsEnrolled: 1245
    });

    const railwaySeries = new TestSeries({
      title: 'Railway NTPC Basic Assessment',
      description: 'Free starter pack for Railway NTPC aspirants. Perfect for evaluating your current preparation level.',
      category: 'Railway',
      difficulty: 'Easy',
      price: 0,
      discountPrice: 0,
      isFree: true,
      rating: 4.5,
      studentsEnrolled: 890
    });

    await sscSeries.save();
    await railwaySeries.save();
    console.log('Test Series Created...');

    // 2. Create Tests for SSC Series
    const sscTest1 = new Test({
      title: 'SSC CGL Mock Test 1 (Full Length)',
      description: 'General Intelligence, Reasoning, General Awareness, Quantitative Aptitude, and English Comprehension.',
      testSeries: sscSeries._id,
      duration: 60, // 60 mins
    });
    const sscTest2 = new Test({
      title: 'SSC CGL Mock Test 2 (Previous Year)',
      description: 'Based on last year\'s exact exam pattern.',
      testSeries: sscSeries._id,
      duration: 60,
    });

    // Create Tests for Railway Series
    const railTest1 = new Test({
      title: 'Railway NTPC Starter Test',
      description: 'Basic Mathematics and General Intelligence test.',
      testSeries: railwaySeries._id,
      duration: 30, // 30 mins
    });
    const railTest2 = new Test({
      title: 'Railway NTPC General Awareness',
      description: 'Focus exclusively on static GK and current affairs.',
      testSeries: railwaySeries._id,
      duration: 15,
    });

    await sscTest1.save();
    await sscTest2.save();
    await railTest1.save();
    await railTest2.save();

    console.log('Tests Created...');

    // Helper to add questions
    const createQuestions = async (testId, questionsData) => {
      let qNum = 1;
      let totalMarks = 0;
      for (let q of questionsData) {
        const question = new Question({
          test: testId,
          questionNumber: qNum++,
          questionText: q.qText,
          options: q.opts,
          correctAnswer: q.ans,
          explanation: q.exp,
          marks: q.m || 2,
          negativeMarks: q.nm || 0.5,
          subject: q.sub || 'General',
        });
        await question.save();
        totalMarks += question.marks;
      }
      return { count: questionsData.length, totalMarks };
    };

    // 3. Questions for SSC Test 1
    const sscT1Qs = await createQuestions(sscTest1._id, [
      {
        sub: 'Quantitative Aptitude',
        qText: 'If A and B can do a piece of work in 15 days and 10 days respectively, in how many days can they complete the work together?',
        opts: ['6 days', '8 days', '5 days', '12 days'],
        ans: 0,
        exp: 'Work done by A in 1 day = 1/15. Work done by B in 1 day = 1/10. Total work in 1 day = 1/15 + 1/10 = (2+3)/30 = 5/30 = 1/6. Hence, 6 days.',
        m: 2, nm: 0.5
      },
      {
        sub: 'General Awareness',
        qText: 'Who is known as the "Father of the Indian Constitution"?',
        opts: ['Mahatma Gandhi', 'Jawaharlal Nehru', 'B.R. Ambedkar', 'Sardar Vallabhbhai Patel'],
        ans: 2,
        exp: 'Dr. B.R. Ambedkar was the chairman of the drafting committee of the Constituent Assembly and is regarded as the chief architect of the Indian Constitution.',
        m: 2, nm: 0.5
      },
      {
        sub: 'English Comprehension',
        qText: 'Choose the correct synonym for "ABUNDANT":',
        opts: ['Scarce', 'Plentiful', 'Rare', 'Limited'],
        ans: 1,
        exp: 'Abundant means existing or available in large quantities; plentiful.',
        m: 2, nm: 0.5
      }
    ]);

    // Questions for SSC Test 2
    const sscT2Qs = await createQuestions(sscTest2._id, [
      {
        sub: 'General Intelligence',
        qText: 'Find the next number in the series: 2, 6, 12, 20, 30, ?',
        opts: ['40', '42', '44', '48'],
        ans: 1,
        exp: 'The pattern is n² + n. For n=1: 1²+1=2. For n=2: 2²+2=6. For n=6: 6²+6=42.',
        m: 2, nm: 0.5
      },
      {
        sub: 'Quantitative Aptitude',
        qText: 'What is the simple interest on Rs. 5000 at 8% per annum for 3 years?',
        opts: ['1000', '1200', '1400', '1600'],
        ans: 1,
        exp: 'SI = (P × R × T) / 100 = (5000 × 8 × 3) / 100 = 1200.',
        m: 2, nm: 0.5
      }
    ]);

    // Questions for Railway Test 1
    const railT1Qs = await createQuestions(railTest1._id, [
      {
        sub: 'Mathematics',
        qText: 'The sum of the first 5 prime numbers is:',
        opts: ['18', '26', '28', '30'],
        ans: 2,
        exp: 'First 5 prime numbers are 2, 3, 5, 7, 11. Sum = 2+3+5+7+11 = 28.',
        m: 1, nm: 0.25
      },
      {
        sub: 'General Science',
        qText: 'Which of the following is the lightest metal?',
        opts: ['Mercury', 'Silver', 'Lithium', 'Lead'],
        ans: 2,
        exp: 'Lithium is the lightest known solid metal, with a density of about 0.534 g/cm3.',
        m: 1, nm: 0.25
      }
    ]);

    // Questions for Railway Test 2
    const railT2Qs = await createQuestions(railTest2._id, [
      {
        sub: 'Current Affairs',
        qText: 'Which planet is known as the "Red Planet"?',
        opts: ['Venus', 'Jupiter', 'Saturn', 'Mars'],
        ans: 3,
        exp: 'Mars is often called the Red Planet because of the iron oxide prevalent on its surface, which gives it a reddish appearance.',
        m: 1, nm: 0.25
      },
      {
        sub: 'History',
        qText: 'The Battle of Plassey was fought in the year:',
        opts: ['1757', '1764', '1857', '1947'],
        ans: 0,
        exp: 'The Battle of Plassey took place on June 23, 1757, resulting in a decisive victory for the British East India Company over the Nawab of Bengal.',
        m: 1, nm: 0.25
      }
    ]);

    // 4. Update Tests with Questions Count & Marks
    sscTest1.totalQuestions = sscT1Qs.count;
    sscTest1.totalMarks = sscT1Qs.totalMarks;
    await sscTest1.save();

    sscTest2.totalQuestions = sscT2Qs.count;
    sscTest2.totalMarks = sscT2Qs.totalMarks;
    await sscTest2.save();

    railTest1.totalQuestions = railT1Qs.count;
    railTest1.totalMarks = railT1Qs.totalMarks;
    await railTest1.save();

    railTest2.totalQuestions = railT2Qs.count;
    railTest2.totalMarks = railT2Qs.totalMarks;
    await railTest2.save();

    // 5. Update Series with Test Count
    sscSeries.totalTests = 2;
    await sscSeries.save();

    railwaySeries.totalTests = 2;
    await railwaySeries.save();

    console.log('Database successfully seeded with beautiful mock data!');
    process.exit();
  } catch (error) {
    console.error('Error with data import:', error);
    process.exit(1);
  }
};

importData();
