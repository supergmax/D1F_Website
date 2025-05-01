'use client';

import React from 'react';
import Head from "next/head";
import { ThemeProvider } from '../src/bolt/context/ThemeContext';
import Header from '../src/bolt/components/Header';
import Hero from '../src/bolt/components/Hero';
import Statistics from '../src/bolt/components/Statistics';
import HowItWorks from '../src/bolt/components/HowItWorks';
import Footer from '../src/bolt/components/Footer';


export default function LandingPage() {
    return (
      <>
        <Head>
          <title>Landing - D1F</title>
        </Head>
        <ThemeProvider>
          <div className="min-h-screen bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
            <Header />
            <main>
              <Hero />
              <Statistics />
              <HowItWorks />
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </>
    );
  }