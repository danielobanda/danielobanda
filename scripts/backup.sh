#!/bin/bash

# Database Backup Script for Student Management System
# This script creates automated database backups with rotation

set -e

# Configuration
BACKUP_DIR="/backups"
DB_NAME="${PGDATABASE:-sms_database}"
DB_USER="${PGUSER:-postgres}"
RETENTION_DAYS="${BACKUP_RETENTION_DAYS:-30}"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/${DB_NAME}_backup_$TIMESTAMP.sql"
COMPRESSED_FILE="$BACKUP_FILE.gz"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Logging function
log() {
    echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Function to create database backup
create_backup() {
    log "Starting database backup for $DB_NAME..."
    
    # Create SQL dump
    if pg_dump -h "$PGHOST" -p "${PGPORT:-5432}" -U "$DB_USER" -d "$DB_NAME" > "$BACKUP_FILE"; then
        log "Database dump created successfully: $BACKUP_FILE"
        
        # Compress the backup
        if gzip "$BACKUP_FILE"; then
            log "Backup compressed successfully: $COMPRESSED_FILE"
            
            # Get file size
            SIZE=$(du -h "$COMPRESSED_FILE" | cut -f1)
            log "Backup size: $SIZE"
            
            return 0
        else
            error "Failed to compress backup file"
            return 1
        fi
    else
        error "Failed to create database backup"
        return 1
    fi
}

# Function to clean old backups
cleanup_old_backups() {
    log "Cleaning up backups older than $RETENTION_DAYS days..."
    
    if find "$BACKUP_DIR" -name "${DB_NAME}_backup_*.sql.gz" -type f -mtime +$RETENTION_DAYS -delete 2>/dev/null; then
        DELETED_COUNT=$(find "$BACKUP_DIR" -name "${DB_NAME}_backup_*.sql.gz" -type f -mtime +$RETENTION_DAYS 2>/dev/null | wc -l)
        if [ "$DELETED_COUNT" -gt 0 ]; then
            log "Cleaned up $DELETED_COUNT old backup files"
        else
            log "No old backup files to clean up"
        fi
    else
        warning "Could not clean up old backup files"
    fi
}

# Function to verify backup integrity
verify_backup() {
    log "Verifying backup integrity..."
    
    if gunzip -t "$COMPRESSED_FILE" 2>/dev/null; then
        log "Backup integrity verification passed"
        return 0
    else
        error "Backup integrity verification failed"
        return 1
    fi
}

# Function to list existing backups
list_backups() {
    log "Existing backups:"
    find "$BACKUP_DIR" -name "${DB_NAME}_backup_*.sql.gz" -type f -exec ls -lh {} \; | sort
}

# Main backup process
main() {
    log "=== Database Backup Script Started ==="
    log "Database: $DB_NAME"
    log "User: $DB_USER"
    log "Host: $PGHOST"
    log "Backup Directory: $BACKUP_DIR"
    log "Retention Period: $RETENTION_DAYS days"
    
    # Check if database is accessible
    if ! pg_isready -h "$PGHOST" -p "${PGPORT:-5432}" -U "$DB_USER" >/dev/null 2>&1; then
        error "Database is not accessible"
        exit 1
    fi
    
    # Create backup
    if create_backup; then
        # Verify backup
        if verify_backup; then
            # Clean old backups
            cleanup_old_backups
            
            # List current backups
            list_backups
            
            log "=== Backup completed successfully ==="
        else
            error "Backup verification failed"
            exit 1
        fi
    else
        error "Backup creation failed"
        exit 1
    fi
}

# Handle script termination
cleanup_on_exit() {
    if [ -f "$BACKUP_FILE" ]; then
        rm -f "$BACKUP_FILE"
        warning "Cleaned up incomplete backup file"
    fi
}

trap cleanup_on_exit EXIT

# Run main function
main "$@"