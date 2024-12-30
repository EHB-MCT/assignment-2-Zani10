'use client';

import React from 'react';
import { useEffect } from 'react';
import { trackPageView, trackClick } from '@/lib/tracker';

const SubscriptionPage = () => {
  useEffect(() => {
    trackPageView('/subscribe');
  }, []);

  const handlePlanSelect = (plan: string) => {
    trackClick(`select-${plan}-plan`, '/subscribe');
    // Mock payment flow - in a real app, this would integrate with a payment provider
    alert('This is a demo - in a real app, this would proceed to payment');
  };

  const plans = [
    {
      name: 'Basic',
      price: '$9',
      features: [
        'Basic analytics dashboard',
        'Up to 10,000 monthly events',
        'Email support',
        '7-day data retention'
      ]
    },
    {
      name: 'Pro',
      price: '$29',
      features: [
        'Advanced analytics dashboard',
        'Up to 100,000 monthly events',
        'Priority support',
        '30-day data retention',
        'Custom event tracking'
      ]
    },
    {
      name: 'Enterprise',
      price: '$99',
      features: [
        'Full analytics suite',
        'Unlimited monthly events',
        '24/7 dedicated support',
        '90-day data retention',
        'Custom event tracking',
        'API access',
        'White-label options'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-12">
            Get started with analytics that help you understand your users better
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transform transition-transform hover:scale-105"
            >
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  {plan.name}
                </h2>
                <p className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-6">
                  {plan.price}
                  <span className="text-base font-normal text-gray-600 dark:text-gray-400">
                    /month
                  </span>
                </p>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center text-gray-600 dark:text-gray-300"
                    >
                      <svg
                        className="h-5 w-5 text-green-500 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handlePlanSelect(plan.name.toLowerCase())}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                >
                  Select {plan.name} Plan
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Need a custom plan?{' '}
            <a
              href="/contact"
              onClick={() => trackClick('contact-sales', '/subscribe')}
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Contact our sales team
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage; 