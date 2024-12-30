'use client';

import React from 'react';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Colors,
  TooltipItem
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { subDays } from 'date-fns';

// Register ChartJS components with enhanced tooltips
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Colors
);

type DateRange = '7days' | '30days' | 'all';
type EventType = 'page_view' | 'click' | 'scroll_depth' | 'form_submission';

interface KPIData {
  totalPageViews: number;
  totalInteractions: number;
  mostPopularPage: string;
  mostFrequentEvent: string;
  averageScrollDepth: number;
  bounceRate: number;
  averageTimeOnPage: number;
  conversionRate: number;
}

interface UserJourney {
  path: string[];
  count: number;
}

interface SessionData {
  [key: string]: string[];
}

interface JourneyCounts {
  [key: string]: number;
}

const formatPath = (path: string) => {
  return path === '/' ? 'Homepage' : path.replace(/^\//, '').replace(/-/g, ' ');
};

const Dashboard = () => {
  const [data, setData] = useState<{ event_type: string; count: number }[]>([]);
  const [dateRange, setDateRange] = useState<DateRange>('7days');
  const [selectedEventTypes, setSelectedEventTypes] = useState<EventType[]>(['page_view', 'click', 'scroll_depth', 'form_submission']);
  const [kpiData, setKpiData] = useState<KPIData>({
    totalPageViews: 0,
    totalInteractions: 0,
    mostPopularPage: '',
    mostFrequentEvent: '',
    averageScrollDepth: 0,
    bounceRate: 0,
    averageTimeOnPage: 0,
    conversionRate: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userJourneys, setUserJourneys] = useState<UserJourney[]>([]);

  const fetchData = async (range: DateRange) => {
    setIsLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('user_interactions')
        .select('*');

      // Apply date filter
      if (range !== 'all') {
        const daysToSubtract = range === '7days' ? 7 : 30;
        const startDate = subDays(new Date(), daysToSubtract).toISOString();
        query = query.gte('timestamp', startDate);
      }

      const result = await query;

      if (result.error) {
        throw new Error(result.error.message);
      }

      if (result.data) {
        // Calculate KPIs
        const pageViews = result.data.filter(item => item.event_type === 'page_view');
        const formSubmissions = result.data.filter(item => item.event_type === 'form_submission');
        const scrollEvents = result.data.filter(item => item.event_type === 'scroll_depth');
        
        // Calculate page counts and user sessions
        const pageCount = pageViews.reduce((acc, curr) => {
          acc[curr.page] = (acc[curr.page] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        // Calculate user journeys
        const journeys = pageViews.reduce<SessionData>((acc, curr) => {
          const sessionId = curr.details?.sessionId as string;
          if (!acc[sessionId]) acc[sessionId] = [];
          acc[sessionId].push(curr.page);
          return acc;
        }, {});

        const journeyCounts = Object.values(journeys).reduce<JourneyCounts>((acc, journey) => {
          const pathKey = journey.join(' → ');
          acc[pathKey] = (acc[pathKey] || 0) + 1;
          return acc;
        }, {});

        const topJourneys: UserJourney[] = Object.entries(journeyCounts)
          .sort(([,a], [,b]) => (b as number) - (a as number))
          .slice(0, 5)
          .map(([path, count]) => ({
            path: path.split(' → '),
            count: count as number
          }));

        // Calculate bounce rate
        const totalSessions = Object.keys(journeys).length;
        const bounceSessions = Object.values(journeys).filter(j => j.length === 1).length;
        const bounceRate = totalSessions ? (bounceSessions / totalSessions) * 100 : 0;

        // Calculate average scroll depth
        const avgScrollDepth = scrollEvents.length
          ? scrollEvents.reduce((acc, curr) => acc + (curr.details?.depth as number || 0), 0) / scrollEvents.length
          : 0;

        // Calculate conversion rate
        const conversionRate = pageViews.length
          ? (formSubmissions.length / pageViews.length) * 100
          : 0;

        // Calculate average time on page
        const avgTimeOnPage = result.data
          .filter(item => item.details?.timeOnPage)
          .reduce((acc, curr) => acc + (curr.details?.timeOnPage as number || 0), 0) / pageViews.length;

        const mostVisitedPage = Object.entries(pageCount)
          .sort(([,a], [,b]) => (b as number) - (a as number))[0]?.[0] || '';

        const eventCount = result.data.reduce((acc, curr) => {
          acc[curr.event_type] = (acc[curr.event_type] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        const mostFrequent = Object.entries(eventCount)
          .sort(([,a], [,b]) => (b as number) - (a as number))[0]?.[0] || '';

        setKpiData({
          totalPageViews: pageViews.length,
          totalInteractions: result.data.length,
          mostPopularPage: mostVisitedPage,
          mostFrequentEvent: mostFrequent,
          averageScrollDepth: Math.round(avgScrollDepth),
          bounceRate: Math.round(bounceRate),
          averageTimeOnPage: Math.round(avgTimeOnPage),
          conversionRate: Math.round(conversionRate * 100) / 100
        });

        setUserJourneys(topJourneys);

        // Process chart data
        const filteredData = result.data.filter(item => 
          selectedEventTypes.includes(item.event_type as EventType)
        );

        const counts = filteredData.reduce<Record<string, number>>((acc, curr) => {
          const eventType = curr.event_type as string;
          acc[eventType] = (acc[eventType] || 0) + 1;
          return acc;
        }, {});

        const processedData = Object.entries(counts).map(([event_type, count]) => ({
          event_type,
          count
        }));

        setData(processedData);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData(dateRange);
  }, [dateRange, selectedEventTypes]);

  const handleExportData = () => {
    const csvContent = [
      // Headers
      ['Event Type', 'Count'],
      // Data rows
      ...data.map(item => [item.event_type, item.count.toString()])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-data-${dateRange}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const chartData = {
    labels: data.map((item) => item.event_type.replace('_', ' ')),
    datasets: [
      {
        label: 'Interactions by Type',
        data: data.map((item) => item.count),
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
        ]
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 2,
    plugins: {
      legend: {
        position: 'top' as const,
        align: 'end' as const,
      },
      tooltip: {
        callbacks: {
          label: function(tooltipItem: TooltipItem<'bar'>) {
            const value = tooltipItem.raw as number;
            const total = data.reduce((acc, item) => acc + item.count, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `Count: ${value} (${percentage}%)`;
          }
        }
      }
    },
    animation: {
      duration: 750,
      easing: 'easeInOutQuart' as const
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0
        }
      }
    }
  };

  if (error) {
    return (
      <div className="h-screen p-4 bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">Error loading dashboard data</div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => fetchData(dateRange)}
            className="btn-primary"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 dark:bg-gray-900 py-6">
      <div className="container max-w-screen-2xl mx-auto px-4">
        {/* Top Section: Header and Controls */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Analytics Dashboard
          </h1>
          <div className="flex items-center gap-4">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as DateRange)}
              className="rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-1.5"
              aria-label="Select date range"
            >
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="all">All Time</option>
            </select>
            <button
              onClick={handleExportData}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg transition-colors text-sm"
              disabled={isLoading || data.length === 0}
            >
              Export CSV
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-[calc(100vh-16rem)]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : data.length === 0 ? (
          <div className="flex items-center justify-center h-[calc(100vh-16rem)]">
            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                No data available for the selected filters
              </p>
              <button
                onClick={() => fetchData(dateRange)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Refresh Data
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-[300px,1fr] gap-6">
            {/* Left Column: KPIs and Filters */}
            <div className="space-y-6">
              {/* KPI Cards */}
              <div className="grid grid-rows-4 gap-4">
                <div className="card bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Total Page Views
                  </h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {kpiData.totalPageViews}
                  </p>
                </div>
                <div className="card bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Bounce Rate
                  </h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {kpiData.bounceRate}%
                  </p>
                </div>
                <div className="card bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Avg. Scroll Depth
                  </h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {kpiData.averageScrollDepth}%
                  </p>
                </div>
                <div className="card bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Conversion Rate
                  </h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {kpiData.conversionRate}%
                  </p>
                </div>
              </div>

              {/* User Journeys */}
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
                  </svg>
                  Top User Journeys
                </h3>
                <div className="space-y-3">
                  {userJourneys.map((journey, index) => (
                    <div key={index} className="p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Journey {index + 1}
                          <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                            ({journey.count} {journey.count === 1 ? 'user' : 'users'})
                          </span>
                        </span>
                      </div>
                      <div className="text-sm text-blue-600 dark:text-blue-400 flex items-center flex-wrap gap-1">
                        {journey.path.map((step, stepIndex) => (
                          <React.Fragment key={stepIndex}>
                            {stepIndex > 0 && (
                              <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            )}
                            <span className="px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-900/30">
                              {formatPath(step)}
                            </span>
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Event Type Filters */}
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                  Event Types
                </h3>
                <div className="space-y-2">
                  {(['page_view', 'click', 'scroll_depth', 'form_submission'] as EventType[]).map((type) => (
                    <label key={type} className="flex items-center p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedEventTypes.includes(type)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedEventTypes([...selectedEventTypes, type]);
                          } else {
                            setSelectedEventTypes(selectedEventTypes.filter(t => t !== type));
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300 capitalize">
                        {type.replace('_', ' ')}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Chart */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <Bar options={options} data={chartData} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
