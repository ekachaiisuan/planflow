# Project Info

---

## Project Goal

## Overview

An internal project tracking system designed for real-world use,
focused on simplicity and comfort through an intuitive UI
that is easy to understand and minimizes unnecessary steps.

## Core Features

- Workspace
- File Management
- PDF Report
- Search

## Secondary Features

- Notification
- Priority
- Calendar View
- Approval Flow

---

## Development Environment

- Next.js 16 App Router runs locally.
- NeonDB is used as the PostgreSQL database.
- File storage uses AWS S3 during development.
- File uploads must use S3-compatible APIs.
- All storage access must be implemented through a storage abstraction layer.

## Production Environment

- Application runs in Docker behind Nginx.
- Database is NeonDB.
- File storage is MinIO running on a dedicated storage server.
- Application servers are stateless.
- Never store user files on the application server filesystem.
- Store only metadata and storage keys in the database.
- Use presigned URLs for upload and download.

## Storage Design Rules

- Development uses AWS S3.
- Production uses MinIO.
- Code must remain S3-compatible.
- Do not store full file URLs in the database.
- Store only object keys (storage keys).
- Business logic must not depend on a specific storage provider.
- Storage providers should be configurable through environment variables.

## Example:

storage_key:
projects/2026/project-001/report.pdf

## Do NOT store:

https://bucket.s3.amazonaws.com/projects/2026/project-001/report.pdf
