# Project Structure

This document explains the file and folder structure of the project.

---

## **Folder Structure**
```plaintext
root/
├── app/                     # Main Next.js application folder
│   ├── layout.tsx           # Root layout for the app
│   ├── page.tsx             # Homepage
│   ├── dashboard/           # Dashboard pages
│   │   ├── page.tsx         # Dashboard main page
│   │   ├── components/      # Dashboard-specific components
│   │   │   ├── Chart.tsx    # Chart component for data visualization
│   │   │   ├── Table.tsx    # Table component for user interaction data
│   │   │   └── Filters.tsx  # Filter component for dashboard data
│   ├── auth/                # Authentication pages
│   │   ├── login.tsx        # Login page
│   │   ├── signup.tsx       # Signup page
│   │   └── forgot-password.tsx # Password recovery page (if applicable)
├── components/              # Shared UI components
│   ├── Navbar.tsx           # Navigation bar
│   ├── Footer.tsx           # Footer
│   ├── ThemeToggle.tsx      # Dark/light mode toggle
│   └── Button.tsx           # Reusable button component
├── contexts/                # React context providers
│   ├── AuthContext.tsx      # Authentication context
│   ├── TrackerContext.tsx   # Event tracking context
├── utils/                     # Utilities and configurations
│   ├── supabaseClient.ts    # Supabase client setup
│   ├── tracker.ts           # Utility functions for event tracking
├── styles/                  # Global and component-specific styles
│   ├── globals.css          # Main global CSS file
│   ├── variables.css        # CSS variables (e.g., colors, spacing)
├── public/                  # Static assets
│   ├── favicon.ico          # Favicon
│   └── images/              # Static image assets
│       └── logo.png         # Project logo
├── docs/                    # Documentation files
│   ├── dataflow.md          # Dataflow documentation
│   ├── structure.md         # Project structure documentation
├── .gitignore               # Files and folders to ignore in Git
├── package.json             # NPM dependencies and scripts
├── tsconfig.json            # TypeScript configuration
└── next.config.js           # Next.js configuration file
├── README.md                # Main project overview
```

## **Key Files**
1. **`app/`**
   - Contains the main pages of the application, including the homepage, dashboard, and authentication pages.

2. **`contexts/`**
   - Houses React context providers for shared state management, such as `AuthContext` for user authentication and `TrackerContext` for interaction tracking.

3. **`utils/`**
   - Includes utility functions and configuration files, such as the Supabase client setup.

4. **`docs/`**
   - Contains project documentation, including this structure file and the dataflow documentation.

---

## **Development Guidelines**
1. **Component Structure**
   - Reusable components should be placed in `components/`.
   - Page-specific components should reside in the respective page directories (e.g., `dashboard/components/`).

2. **State Management**
   - Use context providers (`AuthContext`, `TrackerContext`) for global state.
   - Avoid passing props deeply by leveraging React context where applicable.

