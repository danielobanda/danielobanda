#!/bin/bash

# Student Management System Deployment Script
# Usage: ./scripts/deploy.sh [environment]

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
ENVIRONMENT=${1:-production}
PROJECT_NAME="student-management-system"
BACKUP_DIR="./backups"
LOG_FILE="./logs/deploy.log"

# Functions
log() {
    echo -e "${BLUE}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" | tee -a "$LOG_FILE"
    exit 1
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1" | tee -a "$LOG_FILE"
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1" | tee -a "$LOG_FILE"
}

# Create necessary directories
create_directories() {
    log "Creating necessary directories..."
    mkdir -p logs backups ssl nginx
    success "Directories created successfully"
}

# Check prerequisites
check_prerequisites() {
    log "Checking prerequisites..."
    
    # Check if Docker is installed
    if ! command -v docker &> /dev/null; then
        error "Docker is not installed. Please install Docker first."
    fi
    
    # Check if Docker Compose is installed
    if ! command -v docker-compose &> /dev/null; then
        error "Docker Compose is not installed. Please install Docker Compose first."
    fi
    
    # Check if .env file exists
    if [ ! -f ".env" ]; then
        warning ".env file not found. Creating from template..."
        cp .env.example .env 2>/dev/null || echo "Please create .env file manually"
    fi
    
    success "Prerequisites check completed"
}

# Database backup
backup_database() {
    if [ "$ENVIRONMENT" = "production" ]; then
        log "Creating database backup..."
        BACKUP_FILE="$BACKUP_DIR/backup-$(date +%Y%m%d-%H%M%S).sql"
        
        # Only backup if containers are running
        if docker-compose -f docker-compose.prod.yml ps postgres | grep -q "Up"; then
            docker-compose -f docker-compose.prod.yml exec -T postgres pg_dump -U postgres sms_database > "$BACKUP_FILE"
            success "Database backup created: $BACKUP_FILE"
        else
            warning "Database container not running, skipping backup"
        fi
    fi
}

# Build and deploy
deploy() {
    log "Starting deployment for $ENVIRONMENT environment..."
    
    case $ENVIRONMENT in
        "development")
            log "Building development environment..."
            docker-compose down
            docker-compose build --no-cache
            docker-compose up -d
            ;;
        "production")
            log "Building production environment..."
            
            # Pull latest images
            docker-compose -f docker-compose.prod.yml pull
            
            # Build application
            docker-compose -f docker-compose.prod.yml build --no-cache
            
            # Stop old containers
            docker-compose -f docker-compose.prod.yml down
            
            # Start new containers
            docker-compose -f docker-compose.prod.yml up -d
            ;;
        *)
            error "Unknown environment: $ENVIRONMENT. Use 'development' or 'production'"
            ;;
    esac
    
    success "Deployment completed successfully"
}

# Run database migrations
run_migrations() {
    log "Running database migrations..."
    
    # Wait for database to be ready
    sleep 10
    
    if [ "$ENVIRONMENT" = "production" ]; then
        docker-compose -f docker-compose.prod.yml exec api npm run migrate
    else
        docker-compose exec api npm run migrate
    fi
    
    success "Database migrations completed"
}

# Health check
health_check() {
    log "Performing health check..."
    
    # Wait for services to start
    sleep 15
    
    # Check API health
    if curl -f http://localhost:5000/health > /dev/null 2>&1; then
        success "API health check passed"
    else
        error "API health check failed"
    fi
    
    # Check if containers are running
    if [ "$ENVIRONMENT" = "production" ]; then
        COMPOSE_FILE="docker-compose.prod.yml"
    else
        COMPOSE_FILE="docker-compose.yml"
    fi
    
    RUNNING_CONTAINERS=$(docker-compose -f "$COMPOSE_FILE" ps --services --filter "status=running")
    EXPECTED_CONTAINERS=$(docker-compose -f "$COMPOSE_FILE" config --services)
    
    if [ "$RUNNING_CONTAINERS" = "$EXPECTED_CONTAINERS" ]; then
        success "All containers are running"
    else
        warning "Some containers may not be running properly"
        docker-compose -f "$COMPOSE_FILE" ps
    fi
}

# Cleanup old images and containers
cleanup() {
    log "Cleaning up old Docker images and containers..."
    
    # Remove unused images
    docker image prune -f
    
    # Remove unused containers
    docker container prune -f
    
    # Remove unused volumes (be careful with this in production)
    if [ "$ENVIRONMENT" = "development" ]; then
        docker volume prune -f
    fi
    
    success "Cleanup completed"
}

# SSL Certificate setup (production only)
setup_ssl() {
    if [ "$ENVIRONMENT" = "production" ]; then
        log "Setting up SSL certificates..."
        
        if [ ! -f "ssl/cert.pem" ] || [ ! -f "ssl/key.pem" ]; then
            warning "SSL certificates not found. Please add your SSL certificates to the ssl/ directory"
            warning "Expected files: ssl/cert.pem and ssl/key.pem"
            
            # Create self-signed certificate for testing (NOT for production use)
            read -p "Create self-signed certificate for testing? (y/N): " -n 1 -r
            echo
            if [[ $REPLY =~ ^[Yy]$ ]]; then
                openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
                    -keyout ssl/key.pem \
                    -out ssl/cert.pem \
                    -subj "/C=US/ST=State/L=City/O=Organization/OU=OrgUnit/CN=localhost"
                warning "Self-signed certificate created. Replace with proper SSL certificate for production!"
            fi
        else
            success "SSL certificates found"
        fi
    fi
}

# Monitor deployment
monitor() {
    log "Starting deployment monitoring..."
    
    if [ "$ENVIRONMENT" = "production" ]; then
        COMPOSE_FILE="docker-compose.prod.yml"
    else
        COMPOSE_FILE="docker-compose.yml"
    fi
    
    echo -e "\n${BLUE}Container Status:${NC}"
    docker-compose -f "$COMPOSE_FILE" ps
    
    echo -e "\n${BLUE}Recent Logs:${NC}"
    docker-compose -f "$COMPOSE_FILE" logs --tail=50
    
    echo -e "\n${BLUE}To monitor logs in real-time, run:${NC}"
    echo "docker-compose -f $COMPOSE_FILE logs -f"
}

# Main deployment process
main() {
    log "Starting Student Management System deployment..."
    log "Environment: $ENVIRONMENT"
    
    # Create log file
    mkdir -p "$(dirname "$LOG_FILE")"
    touch "$LOG_FILE"
    
    create_directories
    check_prerequisites
    setup_ssl
    backup_database
    deploy
    run_migrations
    health_check
    cleanup
    monitor
    
    success "Deployment completed successfully!"
    echo -e "\n${GREEN}🎉 Student Management System is now running!${NC}"
    
    if [ "$ENVIRONMENT" = "production" ]; then
        echo -e "🌐 Access your application at: ${BLUE}https://your-domain.com${NC}"
    else
        echo -e "🌐 Access your application at: ${BLUE}http://localhost:3000${NC}"
    fi
    
    echo -e "📊 API Health Check: ${BLUE}http://localhost:5000/health${NC}"
    echo -e "📋 View logs: ${BLUE}docker-compose -f docker-compose$([ "$ENVIRONMENT" = "production" ] && echo ".prod").yml logs -f${NC}"
}

# Script entry point
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi