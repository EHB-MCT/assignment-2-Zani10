# Dataflow Documentation

This document describes the flow of data in the application and how different components interact with each other.

---

## **Authentication Flow**
1. **Sign Up**
   - The user provides their `email`, `password`, and `username` through the `AuthContext`.
   - `supabase.auth.signUp` is called to create the user in the Supabase Auth system.
   - Upon successful sign-up, a new entry is created in the `users` table via Supabase `insert`.

2. **Sign In**
   - The user enters their `email` and `password`.
   - `supabase.auth.signInWithPassword` authenticates the user and retrieves the session.
   - If successful, the user's profile is fetched from the `users` table using their `id`.

3. **Sign Out**
   - The user clicks the "Sign Out" button.
   - `supabase.auth.signOut` is called to invalidate the session.
   - The local user state is cleared, and the user is redirected to the homepage.

---

## **User Interaction Tracking**
1. **Event Tracking**
   - Each user action (e.g., clicking a button or navigating a page) triggers the `trackEvent` function in `TrackerContext`.
   - Events are recorded in the `user_interactions` table with the following details:
     - `user_id`: ID of the currently authenticated user (or `null` for anonymous interactions).
     - `event_type`: Type of event (e.g., "click", "navigation").
     - `page`: Current page where the event occurred.
     - `event_target`: The element or component that triggered the event.
     - `details`: Additional metadata about the interaction.

2. **Session Handling**
   - Each tracked event includes a `session_id` generated for the user session.
   - This ID is used to group multiple interactions within the same session.

---

## **Dashboard Data Flow**
1. **Data Aggregation**
   - The `user_interactions` table stores raw event data.
   - Queries aggregate data to compute metrics such as:
     - Most visited pages.
     - Top user journeys.
     - Interaction types.

2. **Visualization**
   - Aggregated data is passed to the frontend and displayed on the dashboard.
   - Charts and tables are dynamically updated to reflect user behavior.

---

## **RLS Policies**
1. **`users` Table**
   - Users can only view and update their own profile (`auth.uid() = id`).

2. **`user_interactions` Table**
   - Users can view their own interactions.
   - All users can insert interaction events.

