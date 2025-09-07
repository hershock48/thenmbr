# Cursor AI Development Guidelines for NMBR Platform

## Overview
This document defines Cursor AI's role and strengths for the NMBR Platform development. Cursor excels at code implementation, refactoring, debugging, and local development workflows.

## Cursor AI's Core Strengths

### 1. Code Implementation & Refactoring
**What Cursor does best:**
- Implementing specific features with precise code changes
- Refactoring existing code for better performance and maintainability
- Converting designs/mockups into functional components
- Optimizing database queries and API endpoints
- Code cleanup and standardization

**Example tasks:**
- "Implement the Stripe webhook handler for donation processing"
- "Refactor the newsletter builder to use React Query for better caching"
- "Optimize the subscriber management queries to reduce load times"
- "Add TypeScript types to all API routes"

### 2. Backend Development & APIs
**What Cursor does best:**
- Building robust API endpoints with proper error handling
- Database schema design and migrations
- Authentication and authorization implementation
- Third-party service integrations (Stripe, email providers, etc.)
- Server-side validation and security

**Example tasks:**
- "Create API endpoints for the new analytics dashboard"
- "Implement row-level security policies in Supabase"
- "Add rate limiting to the donation widget API"
- "Set up automated email sequences for donor follow-ups"

### 3. Testing & Quality Assurance
**What Cursor does best:**
- Writing comprehensive unit and integration tests
- Setting up testing frameworks and CI/CD pipelines
- Performance testing and optimization
- Security auditing and vulnerability fixes
- Code quality improvements

**Example tasks:**
- "Add Jest tests for all utility functions"
- "Set up Playwright tests for the donation flow"
- "Implement error boundaries for better error handling"
- "Add input validation to all forms"

### 4. DevOps & Deployment
**What Cursor does best:**
- Environment configuration and management
- Build optimization and bundling
- Deployment automation
- Monitoring and logging setup
- Performance monitoring

**Example tasks:**
- "Set up staging environment with proper environment variables"
- "Optimize the build process to reduce bundle size"
- "Configure error tracking with Sentry"
- "Set up database backups and monitoring"

### 5. Local Development Workflow
**What Cursor does best:**
- Git workflow management and branch strategies
- Package management and dependency updates
- Local development environment setup
- Code formatting and linting configuration
- Development tooling optimization

**Example tasks:**
- "Set up pre-commit hooks for code quality"
- "Configure ESLint and Prettier for the project"
- "Update all dependencies to latest stable versions"
- "Set up development database seeding scripts"

## Task Prioritization Framework

### High Priority (Cursor's Sweet Spot)
1. **Backend Logic Implementation**
   - API route handlers
   - Database operations
   - Business logic functions
   - Data validation and sanitization

2. **Performance Optimization**
   - Query optimization
   - Bundle size reduction
   - Caching strategies
   - Memory leak fixes

3. **Security Implementation**
   - Authentication flows
   - Authorization checks
   - Input sanitization
   - CSRF protection

4. **Testing & Debugging**
   - Unit test coverage
   - Integration testing
   - Bug fixes and error handling
   - Performance profiling

### Medium Priority
1. **Feature Implementation**
   - Converting designs to code
   - Adding new functionality
   - Component development
   - Form handling

2. **Code Quality**
   - Refactoring legacy code
   - TypeScript migration
   - Code documentation
   - Standardization

### Lower Priority (Consider v0 for these)
1. **UI/UX Design**
   - Visual design decisions
   - User experience flows
   - Design system creation
   - Responsive design patterns

2. **Creative Problem Solving**
   - Architecture decisions
   - Technology selection
   - Design pattern choices
   - User journey mapping

## NMBR Platform Specific Guidelines

### Database Operations
- Use Supabase client patterns established in the codebase
- Implement proper RLS policies for all tables
- Use TypeScript types for all database operations
- Follow the established naming conventions

### API Development
- Follow REST conventions for all endpoints
- Implement proper error handling with consistent error responses
- Use middleware for authentication and validation
- Add comprehensive logging for debugging

### Component Development
- Use the established design system components
- Follow the component patterns in `/components/patterns/`
- Implement proper loading and error states
- Ensure mobile responsiveness

### Testing Strategy
- Focus on business logic and API endpoint testing
- Test donation flows thoroughly (critical path)
- Implement email template testing
- Add performance tests for heavy operations

## Communication Protocol

### When to Ask for Clarification
- Business logic requirements are unclear
- Design specifications are missing
- Performance requirements need definition
- Security requirements need clarification

### When to Suggest Alternatives
- Performance optimizations
- Security improvements
- Code architecture improvements
- Development workflow enhancements

### Progress Reporting
- Provide regular updates on implementation progress
- Highlight any blockers or dependencies
- Suggest improvements or optimizations discovered
- Document any architectural decisions made

## Success Metrics

### Code Quality
- Test coverage above 80% for critical paths
- No TypeScript errors or warnings
- Consistent code formatting and linting
- Proper error handling throughout

### Performance
- Page load times under 2 seconds
- API response times under 500ms
- Bundle size optimized
- Database queries optimized

### Security
- All inputs validated and sanitized
- Proper authentication and authorization
- HTTPS everywhere
- Secure headers implemented

### Reliability
- Comprehensive error handling
- Graceful degradation
- Proper logging and monitoring
- Automated testing coverage

## Next Steps for NMBR Platform

### Immediate Priorities
1. **Production Readiness**
   - Environment configuration
   - Error handling and logging
   - Performance optimization
   - Security hardening

2. **Testing Implementation**
   - Unit tests for utility functions
   - Integration tests for API endpoints
   - E2E tests for critical user flows
   - Performance testing

3. **DevOps Setup**
   - CI/CD pipeline configuration
   - Staging environment setup
   - Monitoring and alerting
   - Backup strategies

### Medium-term Goals
1. **Feature Enhancement**
   - Advanced analytics implementation
   - Email automation workflows
   - Payment processing optimization
   - Mobile app considerations

2. **Scalability Preparation**
   - Database optimization
   - Caching strategies
   - CDN implementation
   - Load balancing considerations

This document should help Cursor AI focus on its strengths while building upon the solid foundation we've created together.
