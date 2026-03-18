'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  FaRunning,
  FaSwimmer,
  FaBiking,
  FaUsers,
  FaCalendarAlt,
  FaMapMarkedAlt,
  FaArrowRight,
  FaUserCircle,
} from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function AboutPage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  const features = [
    {
      icon: <FaUsers className="h-6 w-6" />,
      title: 'Find Training Partners',
      description:
        'Connect with like-minded athletes in your area who share your passion for training.',
    },
    {
      icon: <FaMapMarkedAlt className="h-6 w-6" />,
      title: 'Discover Local Events',
      description:
        'Browse and join training events happening nearby, filtered by activity and skill level.',
    },
    {
      icon: <FaCalendarAlt className="h-6 w-6" />,
      title: 'Create Your Own Events',
      description:
        'Organize training sessions and invite others to join you on your fitness journey.',
    },
    {
      icon: <FaRunning className="h-6 w-6" />,
      title: 'Multiple Activities',
      description:
        'Whether you enjoy running, swimming, or cycling, find partners for any activity you love.',
    },
  ];

  const testimonials = [
    {
      quote:
        'This app helped me find consistent training partners, which made it so much easier to stick to my running schedule.',
      name: 'Sarah J.',
      role: 'Marathon Runner',
    },
    {
      quote:
        'I was new to triathlon training and found an amazing group that helped me prepare for my first event.',
      name: 'Michael T.',
      role: 'Triathlete',
    },
    {
      quote:
        'The motivation I get from training with others has completely transformed my fitness routine.',
      name: 'Emma L.',
      role: 'Fitness Enthusiast',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <section className="relative h-[80vh] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/swim.jpg"
            alt="People training together"
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="container mx-auto px-6 relative h-full flex items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl text-white"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              Never Train Alone Again
            </h1>
            <p className="text-xl md:text-2xl mb-8">
              Find training partners, join events, and build a community that
              keeps you motivated.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/trainings" className="btn btn-primary btn-lg">
                Find Training Events
              </Link>
              <Link
                href="/signin"
                className="btn btn-outline btn-lg text-white border-white hover:bg-white"
              >
                Join Now - It&apos;s Free
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.h2
              variants={itemVariants}
              className="text-3xl md:text-4xl font-bold text-neutral-800 mb-4"
            >
              How It Works
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="text-lg text-neutral-600 max-w-2xl mx-auto"
            >
              Our platform makes it simple to connect with other athletes and
              stay motivated on your fitness journey.
            </motion.p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-neutral-50 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-14 h-14 rounded-full flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-neutral-800 mb-3">
                  {feature.title}
                </h3>
                <p className="text-neutral-600">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-neutral-50">
        <div className="container mx-auto px-6">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-col lg:flex-row items-center gap-12"
          >
            <motion.div variants={itemVariants} className="flex-1">
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-6">
                Perfect for Triathlon Training
              </h2>
              <p className="text-lg text-neutral-600 mb-8">
                Triathlon training requires consistent practice across multiple
                disciplines. Our platform is specially designed to help you
                excel in all three sports.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 mt-1">
                    <FaSwimmer className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Swimming</h3>
                    <p className="text-neutral-600">
                      Find partners for open water swims or pool sessions to
                      improve your technique and build endurance.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 mt-1">
                    <FaBiking className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Cycling</h3>
                    <p className="text-neutral-600">
                      Join group rides to explore new routes and develop your
                      cycling skills in a supportive environment.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 mt-1">
                    <FaRunning className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Running</h3>
                    <p className="text-neutral-600">
                      Connect with running partners at your pace to stay
                      motivated through tough training blocks.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex-1">
              <div className="relative h-[500px] rounded-xl overflow-hidden shadow-xl">
                <Image
                  src="/images/swim4.jpg"
                  alt="Various training activities"
                  fill
                  className="object-cover"
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.h2
              variants={itemVariants}
              className="text-3xl md:text-4xl font-bold text-neutral-800 mb-4"
            >
              Getting Started Is Easy
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="text-lg text-neutral-600 max-w-2xl mx-auto"
            >
              Be among the first to use our platform and help build a vibrant
              community of like-minded athletes.
            </motion.p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto"
          >
            <motion.div
              variants={itemVariants}
              className="bg-neutral-50 p-8 rounded-xl shadow-sm relative"
            >
              <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full text-white flex items-center justify-center font-bold text-xl">
                1
              </div>
              <h3 className="text-xl font-semibold text-neutral-800 mb-4 pt-2">
                Create Your Profile
              </h3>
              <p className="text-neutral-600">
                Sign up and add details about your experience level, preferred
                activities, and training goals. This helps match you with
                compatible training partners.
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="bg-neutral-50 p-8 rounded-xl shadow-sm relative mt-10 md:mt-0"
            >
              <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full text-white flex items-center justify-center font-bold text-xl">
                2
              </div>
              <h3 className="text-xl font-semibold text-neutral-800 mb-4 pt-2">
                Create or Join Events
              </h3>
              <p className="text-neutral-600">
                Be the catalyst for your community by organizing training events
                or browse for events that match your schedule and fitness level.
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="bg-neutral-50 p-8 rounded-xl shadow-sm relative mt-10 md:mt-0"
            >
              <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full text-white flex items-center justify-center font-bold text-xl">
                3
              </div>
              <h3 className="text-xl font-semibold text-neutral-800 mb-4 pt-2">
                Train Together
              </h3>
              <p className="text-neutral-600">
                Meet up with your new training partners and enjoy more
                motivated, social, and effective training sessions that keep you
                coming back.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-6">
              Ready to Find Your Training Partners?
            </h2>
            <p className="text-lg text-neutral-600 mb-8">
              Join our community today and start connecting with athletes in
              your area. It&apos;s completely free!
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/trainings/create" className="btn btn-primary btn-lg">
                Create Your First Event
              </Link>
              <Link href="/trainings" className="btn btn-outline btn-lg">
                Browse Events
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
