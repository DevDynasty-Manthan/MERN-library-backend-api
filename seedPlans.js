import mongoose from 'mongoose';
import Plan from './src/models/plan.js';
import connectDB from './src/config/db.js';
import 'dotenv/config';

const seedPlans = async () => {
  try {
    await connectDB();

    // Clear existing plans
    await Plan.deleteMany({});
    console.log('Cleared existing plans');

    // Create Normal Plan
    const normalPlan = await Plan.create({
      code: 'Normal',
      fees: 500,
      features: [
        'Basic library access',
        'Study room access',
        'WiFi enabled',
        'Standard support',
      ],
      capacity: 60,
    });

    console.log('Normal Plan created:', normalPlan);

    // Create Premium Plan
    const premiumPlan = await Plan.create({
      code: 'Premium',
      fees: 1000,
      features: [
        'Premium library access',
        'Priority study room access',
        'High-speed WiFi',
        '24/7 Premium support',
        'Exclusive resources',
        'Monthly workshops',
      ],
      capacity: 60,
    });

    console.log('Premium Plan created:', premiumPlan);

    console.log('✅ Plans seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding plans:', error);
    process.exit(1);
  }
};

seedPlans();
