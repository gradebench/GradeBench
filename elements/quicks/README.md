# Quick Tests Feature

A comprehensive quick assessment testing system with feature flag control.

## Features

- ✅ Feature flag controlled access (`/quicks/*` routes)
- ✅ Paginated test history dashboard
- ✅ Create new tests with setup wizard
- ✅ File upload for test data
- ✅ Real-time evaluation dashboard
- ✅ Detailed results page

## Pages

### 1. Dashboard (`/quicks`)
- Paginated list of test history
- "New Test" button
- Test status badges
- Quick navigation to results

### 2. Test Setup (`/quicks/new`)
- Test name and description form
- Validation
- Navigation to upload page

### 3. Upload Page (`/quicks/[testId]/upload`)
- Drag & drop file upload
- CSV/JSON support
- File validation
- Progress to evaluation

### 4. Evaluation Dashboard (`/quicks/[testId]/evaluate`)
- Real-time progress tracking
- Question count statistics
- Auto-redirect to results when complete

### 5. Results Page (`/quicks/[testId]/results`)
- Overall score metrics
- Question-by-question breakdown
- Export functionality
- Detailed analysis

## Shared Components

All components are reusable to avoid code duplication:

- `DashboardLayout` - Common layout wrapper
- `FeatureGuard` - Feature flag protection
- `TestStatusBadge` - Status indicator
- `TestHistoryTable` - Paginated table with navigation

## Feature Flag

Enable/disable the feature in `.env`:

```env
NEXT_PUBLIC_ENABLE_QUICK_TESTS=true
```

## Tech Stack

- Next.js 15 (App Router)
- Shadcn UI components
- TypeScript
- Lucide icons

## Usage

```bash
# Navigate to quicks element
cd elements/quicks

# Install dependencies (if needed)
npm install

# Run development server
npm run dev
```

Visit `http://localhost:3000/quicks` to access the dashboard.
