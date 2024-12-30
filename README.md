# User Interaction Analytics Dashboard

A comprehensive analytics solution built with Next.js and Supabase for tracking and analyzing user interactions on websites.

## Features

### Analytics Tracking
- **Page Views**: Automatic tracking of page visits and time spent
- **Click Events**: Track button and link interactions
- **Form Submissions**: Monitor form completions and success rates
- **Scroll Depth**: Measure content engagement through scroll tracking
- **User Journeys**: Track user navigation paths through your site

### Interactive Dashboard
- Real-time data visualization
- Customizable date ranges
- Event type filtering
- Data export capabilities
- Dark mode support
- Responsive design

### Key Metrics
- Total page views and unique visitors
- Bounce rate and session duration
- Average scroll depth
- Conversion rates
- Most popular pages
- Common user journeys

## Tech Stack

- **Frontend**: Next.js 13+ (App Router), React, TypeScript
- **Styling**: Tailwind CSS, Tailwind plugins
- **Charts**: Chart.js, React-Chartjs-2
- **Backend**: Supabase (PostgreSQL, Real-time subscriptions)
- **Authentication**: Supabase Auth
- **Deployment**: Vercel

## Getting Started

1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd user-interaction-analytics-dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file with:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. Initialize Supabase:
   - Create a new Supabase project
   - Run the database schema from `progress.md`
   - Set up row level security policies

5. Start the development server:
   ```bash
   npm run dev
   ```

## Implementation Details

### Database Schema

The main table `user_interactions` stores all tracked events:
```sql
CREATE TABLE user_interactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  event_type TEXT NOT NULL,
  event_target TEXT,
  page TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  details JSONB
);
```

### Tracking System

The tracking system is implemented in `src/app/utils/tracker.ts` and provides:

1. **Event Tracking Functions**:
   ```typescript
   trackPageView(page: string)
   trackClick(target: string, page: string)
   trackFormSubmission(formId: string, page: string, data: object)
   trackScrollDepth(page: string, depth: number)
   ```

2. **Hooks**:
   ```typescript
   useScrollTracking(page: string)
   usePageTracking()
   ```

3. **Utilities**:
   - Debounced event handling
   - Session management
   - Error handling

### Dashboard Implementation

The dashboard (`src/app/dashboard/page.tsx`) features:

1. **Data Fetching**:
   - Real-time Supabase subscriptions
   - Date range filtering
   - Event type filtering

2. **Visualizations**:
   - Interactive bar charts
   - KPI cards
   - User journey analysis

3. **User Interface**:
   - Responsive layout
   - Dark mode support
   - Loading states
   - Error handling

## Usage

### Adding Tracking to Pages

1. Import tracking functions:
   ```typescript
   import { trackPageView, useScrollTracking } from '@/app/utils/tracker';
   ```

2. Implement page tracking:
   ```typescript
   useEffect(() => {
     trackPageView('/about');
   }, []);
   ```

3. Track scroll depth:
   ```typescript
   useScrollTracking('/about');
   ```

4. Track button clicks:
   ```typescript
   <button onClick={() => trackClick('submit-button', '/contact')}>
     Submit
   </button>
   ```

### Accessing Analytics

1. Navigate to `/dashboard`
2. Use date range selector to filter data
3. Toggle event types to focus on specific interactions
4. Export data as needed

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Next.js team for the excellent framework
- Supabase team for the backend infrastructure
- Chart.js contributors for visualization tools
- Tailwind CSS team for the styling framework
