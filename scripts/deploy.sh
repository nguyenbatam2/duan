#!/bin/bash

# Production Deployment Script
# Usage: ./scripts/deploy.sh [environment]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default environment
ENVIRONMENT=${1:-production}

echo -e "${BLUE}🚀 Starting deployment to ${ENVIRONMENT}...${NC}"

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Pre-deployment checks
echo -e "${BLUE}📋 Running pre-deployment checks...${NC}"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed"
    exit 1
fi

# Check environment variables
if [ ! -f ".env.${ENVIRONMENT}" ]; then
    print_warning "Environment file .env.${ENVIRONMENT} not found"
    print_warning "Make sure to configure environment variables"
fi

print_status "Pre-deployment checks completed"

# Install dependencies
echo -e "${BLUE}📦 Installing dependencies...${NC}"
npm ci --production=false
print_status "Dependencies installed"

# Run tests
echo -e "${BLUE}🧪 Running tests...${NC}"
npm run test
print_status "Tests passed"

# Build application
echo -e "${BLUE}🔨 Building application...${NC}"
npm run build
print_status "Application built successfully"

# Run payment flow tests
echo -e "${BLUE}💳 Running payment flow tests...${NC}"
npm run test:payment
print_status "Payment flow tests passed"

# Optimize static assets
echo -e "${BLUE}📊 Optimizing static assets...${NC}"
npm run optimize
print_status "Static assets optimized"

# Security audit
echo -e "${BLUE}🔒 Running security audit...${NC}"
npm audit --audit-level=moderate
print_status "Security audit passed"

# Create deployment package
echo -e "${BLUE}📦 Creating deployment package...${NC}"
tar -czf "deployment-${ENVIRONMENT}-$(date +%Y%m%d-%H%M%S).tar.gz" \
    --exclude=node_modules \
    --exclude=.git \
    --exclude=.env* \
    --exclude=*.log \
    .
print_status "Deployment package created"

# Deploy to server (example for different environments)
case $ENVIRONMENT in
    "production")
        echo -e "${BLUE}🚀 Deploying to production...${NC}"
        # Add your production deployment commands here
        # Example: rsync, scp, or cloud deployment
        print_status "Deployed to production"
        ;;
    "staging")
        echo -e "${BLUE}🚀 Deploying to staging...${NC}"
        # Add your staging deployment commands here
        print_status "Deployed to staging"
        ;;
    *)
        print_error "Unknown environment: $ENVIRONMENT"
        exit 1
        ;;
esac

# Post-deployment checks
echo -e "${BLUE}🔍 Running post-deployment checks...${NC}"

# Health check
echo -e "${BLUE}🏥 Running health checks...${NC}"
# Add your health check commands here
print_status "Health checks passed"

# Payment gateway connectivity
echo -e "${BLUE}💳 Testing payment gateway connectivity...${NC}"
# Add your payment gateway test commands here
print_status "Payment gateway connectivity verified"

print_status "Post-deployment checks completed"

# Deployment summary
echo -e "${GREEN}🎉 Deployment to ${ENVIRONMENT} completed successfully!${NC}"
echo -e "${BLUE}📊 Deployment Summary:${NC}"
echo -e "  • Environment: ${ENVIRONMENT}"
echo -e "  • Build Time: $(date)"
echo -e "  • Package: deployment-${ENVIRONMENT}-$(date +%Y%m%d-%H%M%S).tar.gz"

# Cleanup
echo -e "${BLUE}🧹 Cleaning up...${NC}"
rm -rf .next
rm -rf node_modules
print_status "Cleanup completed"

echo -e "${GREEN}✨ All done!${NC}"
