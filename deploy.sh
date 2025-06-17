#!/bin/bash

# Profession Lookup App Deployment Script
# This script deploys the application on a self-hosted environment

set -e  # Exit on any error

echo "🚀 Starting deployment of Profession Lookup App..."

# Configuration
APP_NAME="profession-lookup-app"
APP_PORT=${PORT:-3001}
LOG_FILE="app.log"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if Node.js is installed
check_nodejs() {
    if ! command -v node &> /dev/null; then
        log_error "Node.js is not installed. Please install Node.js 16+ first."
        exit 1
    fi
    
    NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 16 ]; then
        log_error "Node.js version must be 16 or higher. Current: $(node --version)"
        exit 1
    fi
    
    log_info "Node.js version: $(node --version) ✅"
}

# Function to stop existing application
stop_app() {
    log_info "Stopping existing application..."
    
    # Try to stop using PM2 first
    if command -v pm2 &> /dev/null; then
        pm2 stop $APP_NAME 2>/dev/null || true
        pm2 delete $APP_NAME 2>/dev/null || true
    fi
    
    # Fallback to pkill
    pkill -f "node server.js" 2>/dev/null || true
    sleep 2
    
    log_info "Existing application stopped"
}

# Function to install dependencies
install_deps() {
    log_info "Installing dependencies..."
    
    # Install root dependencies
    npm ci
    
    # Install client dependencies
    cd client
    npm ci
    cd ..
    
    log_info "Dependencies installed ✅"
}

# Function to build the application
build_app() {
    log_info "Building React application..."
    
    cd client
    npm run build
    cd ..
    
    log_info "React build completed ✅"
}

# Function to start the application
start_app() {
    log_info "Starting application..."
    
    # Check if PM2 is available
    if command -v pm2 &> /dev/null; then
        # Use PM2 for process management
        pm2 start server.js --name $APP_NAME --log $LOG_FILE
        log_info "Application started with PM2 ✅"
        pm2 show $APP_NAME
    else
        # Fallback to nohup
        nohup npm start > $LOG_FILE 2>&1 &
        APP_PID=$!
        sleep 3
        
        if ps -p $APP_PID > /dev/null; then
            log_info "Application started with PID: $APP_PID ✅"
            echo $APP_PID > app.pid
        else
            log_error "Failed to start application"
            exit 1
        fi
    fi
}

# Function to verify deployment
verify_deployment() {
    log_info "Verifying deployment..."
    
    sleep 5
    
    if curl -f http://localhost:$APP_PORT > /dev/null 2>&1; then
        log_info "✅ Application is running successfully!"
        log_info "📍 Access your app at: http://localhost:$APP_PORT"
    else
        log_error "❌ Application health check failed"
        log_error "Check logs: tail -f $LOG_FILE"
        exit 1
    fi
}

# Function to display post-deployment info
show_info() {
    echo ""
    echo "🎉 Deployment completed successfully!"
    echo ""
    echo "📱 Application Info:"
    echo "   • URL: http://localhost:$APP_PORT"
    echo "   • Logs: tail -f $(pwd)/$LOG_FILE"
    echo "   • Status: curl http://localhost:$APP_PORT"
    echo ""
    
    if command -v pm2 &> /dev/null; then
        echo "🔧 PM2 Commands:"
        echo "   • Status: pm2 status"
        echo "   • Logs: pm2 logs $APP_NAME"
        echo "   • Stop: pm2 stop $APP_NAME"
        echo "   • Restart: pm2 restart $APP_NAME"
    else
        echo "🔧 Process Management:"
        echo "   • Check process: ps aux | grep 'node server.js'"
        echo "   • Stop: pkill -f 'node server.js'"
    fi
    echo ""
}

# Main deployment flow
main() {
    log_info "Starting deployment process..."
    
    check_nodejs
    stop_app
    install_deps
    build_app
    start_app
    verify_deployment
    show_info
    
    log_info "🚀 Deployment completed successfully!"
}

# Run main function
main "$@" 