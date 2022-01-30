# Syllabus Wiki

#### A free, open source repository for syllabus crowd sourcing at Vanderbilt University.


---

## Components
The package is organized into a single monorepo using Yarn workspaces.

### Frontend
Built in React and Next.JS with Chakra UI used as the design framework.

### Backend
MERT stack, built using TypeScript. Super simple; all routes slapped into a single location. Backend dataset leverages the @vanderbilt/yes-api package.

### Shared
Common TypeScript schemas for API reference across the frontend and backend.

## Running
Syllabus Wiki is currently hosted across two services. Heroku hosts the API backend while Vercel hosts the frontend.

It would be possible to combine the API into Vercel using its edge computing network, but I kept the two separate to enable batch scheduling of YES scraping jobs.

### Environmental Variables

#### Backend

| Name                 | Description                                                           |
|----------------------|-----------------------------------------------------------------------|
| MONGODB_URI          | MongoDB connection URI                                                |
| S3_KEY               | AWS access key ID                                                     |
| S3_SECRET            | AWS access key Secret                                                 |
| S3_BUCKET            | AWS S3 bucket name                                                    |
| GOOGLE_CLIENT_ID     | Google OAuth client ID                                                |
| GOOGLE_CLIENT_SECRET | Google OAuth client Secret                                            |
| AUTH_REDIRECT_URL    | Frontend URL to redirect OAuth requests to. Required for Google OAuth |
| SESSION_SECRET       | Secret to use for securing browser session cookies                    |
| PORT                 | Port to open backend on. Should be auto-set by host                   |
| NODE_ENV             | Should be set to 'production' for deployment                          |
| BUILD_TARGET         | Must be set to 'backend' in order to properly build.                  |

#### Frontend

| Name                    | Description                                                                                      |
|-------------------------|--------------------------------------------------------------------------------------------------|
| NEXT_PUBLIC_BACKEND_URL | Base URL for the backend API                                                                     |
| S3_BUCKET               | S3 bucket URL and path where syllabi can be accessed. THIS IS NOT THE SAME AS BACKEND:S3_BUCKET! |
| BUILD_TARGET            | Must be set to 'frontend' in order to properly build.                                            |