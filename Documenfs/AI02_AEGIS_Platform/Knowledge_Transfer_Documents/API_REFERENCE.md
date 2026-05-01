# AEGIS Platform - API Reference

## Overview

This document provides a comprehensive reference for all API endpoints available in the AEGIS Platform. The platform exposes a RESTful API built with FastAPI, organized into modules corresponding to different functional areas.

Base URL: `http://localhost:8000/api` (development) or `https://yourdomain/api` (production)

## Authentication

Most endpoints do not require authentication for development purposes. In production environments, authentication may be implemented based on specific deployment requirements.

## Rate Limiting

The API implements basic rate limiting to prevent abuse. Excessive requests may result in HTTP 429 (Too Many Requests) responses.

## Common HTTP Status Codes

- `200 OK`: Successful request
- `400 Bad Request`: Invalid request parameters
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server-side error

## Health Check

### GET /health

Returns the current health status of the API service.

**Response:**
```json
{
  "status": "healthy",
  "service": "Financial Data API",
  "timestamp": "2025-01-01T00:00:00"
}
```

## Director Data Endpoints

### GET /api/directors

Retrieve all directors from the database.

**Response:**
```json
[
  {
    "id": 1,
    "name": "John Smith",
    "din": "12345678"
  }
]
```

### GET /api/company-count

Get company count statistics.

**Response:**
```json
{
  "public_limited": 10,
  "private_limited_subsidiary": 5,
  "private_limited_non_subsidiary": 3
}
```

### GET /api/cross-directorship

Analyze cross-directorship information.

**Response:**
```json
[
  {
    "company_a": "Company A",
    "company_b": "Company B",
    "shared_directors": 3
  }
]
```

### GET /api/clustering

Identify director clustering patterns.

**Response:**
```json
[
  {
    "cluster_id": 1,
    "directors": ["John Smith", "Jane Doe", "Bob Johnson"],
    "companies": ["Company A", "Company B", "Company C"]
  }
]
```

### GET /api/network

Generate network data for visualization.

**Response:**
```json
{
  "nodes": [
    {"id": "director_1", "label": "John Smith", "type": "director"},
    {"id": "company_1", "label": "Company A", "type": "company"}
  ],
  "edges": [
    {"from": "director_1", "to": "company_1", "type": "directorship"}
  ]
}
```

### GET /api/wtd-count

Count whole-time directors.

**Response:**
```json
{
  "count": 25
}
```

### GET /api/companies-with-director-count

List companies with director counts.

**Response:**
```json
[
  {
    "name": "Company A",
    "type": "Public Limited Company",
    "director_count": 5
  }
]
```

### POST /api/process-director-docx

Process uploaded director disclosure document.

**Request:**
- Form data with file upload

**Response:**
```json
{
  "status": "success",
  "message": "Document processed successfully",
  "processed_count": 1
}
```

### GET /api/document-summaries

Retrieve document summaries.

**Response:**
```json
[
  {
    "id": 1,
    "director_name": "John Smith",
    "din": "12345678",
    "file_path": "document.docx",
    "summary": "Summary of the document content"
  }
]
```

### POST /api/generate-summary

Generate document summary using LLM.

**Request:**
```json
{
  "document_id": 1
}
```

**Response:**
```json
{
  "status": "success",
  "summary": "Generated summary of the document"
}
```

## Regulatory Data Endpoints

### GET /sebi-analysis-data

Retrieve SEBI analysis data with pagination support.

**Query Parameters:**
- `limit` (integer, default: 100): Number of records to return
- `offset` (integer, default: 0): Number of records to skip

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "date_key": "2025-01-01",
      "row_index": 1,
      "pdf_link": "https://example.com/document.pdf",
      "summary": "Summary of the filing",
      "inserted_at": "2025-01-01T00:00:00"
    }
  ],
  "count": 150
}
```

### GET /bse-alerts

Retrieve BSE alerts data with pagination.

**Query Parameters:**
- `limit` (integer, default: 1000): Number of records to return
- `offset` (integer, default: 0): Number of records to skip

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "date_key": "2025-01-01",
      "row_index": 1,
      "pdf_link": "https://example.com/alert.pdf",
      "summary": "Summary of the alert",
      "inserted_at": "2025-01-01T00:00:00",
      "entity_name": "Company A",
      "nature": "Regulatory Notice"
    }
  ],
  "count": 200
}
```

### GET /bse-monthly-count

Get current month BSE notification count.

**Response:**
```json
{
  "count": 15
}
```

### GET /api/bse-alerts-monthly-count

Monthly count of BSE alerts.

**Response:**
```json
{
  "monthly_data": [
    {
      "month": "2025-01",
      "count": 15
    }
  ],
  "total_count": 200,
  "average_count": 12
}
```

### GET /api/bse-alerts-monthly-total

Current month total BSE alerts.

**Response:**
```json
{
  "count": 15
}
```

### GET /rbi-analysis-data

Retrieve RBI analysis data with pagination.

**Query Parameters:**
- `limit` (integer, default: 100): Number of records to return
- `offset` (integer, default: 0): Number of records to skip

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "date_key": "2025-01-01",
      "row_index": 1,
      "pdf_link": "https://example.com/notification.pdf",
      "summary": "Summary of the notification",
      "inserted_at": "2025-01-01T00:00:00"
    }
  ],
  "count": 75
}
```

### GET /api/rbi-total-count

Get total count of RBI notifications.

**Response:**
```json
{
  "count": 75
}
```

### GET /api/sebi-total-count

Get total count of SEBI notifications.

**Response:**
```json
{
  "count": 150
}
```

## Analytics Endpoints

### GET /api/analytics/companies-by-type

Companies by type distribution.

**Response:**
```json
{
  "public_limited": 10,
  "private_limited_subsidiary": 5,
  "private_limited_non_subsidiary": 3
}
```

### GET /api/analytics/directors-by-company-count

Director distribution.

**Response:**
```json
[
  {
    "company_count": 1,
    "director_count": 20
  },
  {
    "company_count": 2,
    "director_count": 15
  }
]
```

### GET /api/analytics/company-network

Company relationship network.

**Response:**
```json
{
  "nodes": [
    {"id": "company_1", "label": "Company A"},
    {"id": "company_2", "label": "Company B"}
  ],
  "edges": [
    {"from": "company_1", "to": "company_2", "weight": 3}
  ]
}
```

## Meeting Minutes Endpoints

### GET /places

Retrieve all registered meeting places.

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Head Office",
      "address": "123 Business Street, City, Country",
      "is_default": true,
      "created_at": "2025-01-01T00:00:00"
    }
  ],
  "count": 1
}
```

### POST /places

Create a new meeting place.

**Request:**
```json
{
  "name": "Branch Office",
  "address": "456 Corporate Avenue, City, Country",
  "is_default": false
}
```

**Response:**
```json
{
  "id": 2,
  "name": "Branch Office",
  "address": "456 Corporate Avenue, City, Country",
  "is_default": false,
  "created_at": "2025-01-01T00:00:00"
}
```

### POST /generate-minutes

Generate meeting minutes document from template.

**Request:**
```json
{
  "template": "board_meeting",
  "companyName": "Company A",
  "meetingNumber": "1",
  "meetingType": "Board Meeting",
  "meetingDay": "Monday",
  "meetingDate": "2025-01-01",
  "meetingStartTime": "10:00 AM",
  "meetingEndTime": "12:00 PM",
  "meetingPlace": "Head Office",
  "chairmanName": "John Smith",
  "presentDirectors": [
    {"name": "John Smith", "din": "12345678"},
    {"name": "Jane Doe", "din": "87654321"}
  ],
  "inAttendance": [],
  "companySecretary": "Bob Johnson",
  "previousMeetingDate": "2024-12-01",
  "authorisedOfficer": "",
  "quorum": "Met",
  "concerns": "None",
  "declarations": "None",
  "auditorPaymentAmount": "50000",
  "auditorPaymentWords": "Fifty Thousand Only",
  "financialYear": "2024-2025",
  "agmNumber": "1",
  "agmDay": "Monday",
  "agmMonthName": "January",
  "agmDate": "2025-01-01",
  "agmTime": "10:00 AM",
  "agmPlace": "Head Office",
  "recordingDate": "2025-01-01",
  "signingDate": "2025-01-02",
  "signingPlace": "Head Office"
}
```

**Response:**
- DOCX file download

## AI Assistant Endpoints

### POST /ai-assistant/upload

Upload a transcript file for processing.

**Request:**
- Form data with file upload (DOCX or TXT)

**Response:**
```json
{
  "task_id": "uuid-string",
  "message": "File uploaded successfully"
}
```

### POST /ai-assistant/generate-mom

Generate Meeting Minutes from uploaded transcript.

**Request:**
```json
{
  "task_id": "uuid-string"
}
```

**Response:**
```json
{
  "task_id": "uuid-string",
  "status": "processing",
  "message": "Generating Meeting Minutes"
}
```

### GET /ai-assistant/status/{task_id}

Get status of Meeting Minutes generation.

**Response:**
```json
{
  "task_id": "uuid-string",
  "status": "completed",
  "message": "Meeting Minutes generated successfully",
  "created_at": "2025-01-01T00:00:00",
  "started_at": "2025-01-01T00:01:00",
  "completed_at": "2025-01-01T00:05:00"
}
```

### GET /ai-assistant/mom/{task_id}

Get structured Meeting Minutes content.

**Response:**
```json
{
  "title": "Board Meeting",
  "date": "2025-01-01",
  "attendees": [
    {"name": "John Smith", "role": "Chairman"},
    {"name": "Jane Doe", "role": "Director"}
  ],
  "agenda": [
    "Approval of previous meeting minutes",
    "Financial report review"
  ],
  "decisions": [
    "Previous minutes approved",
    "Quarterly dividend declared"
  ],
  "action_items": [
    {"task": "Prepare annual report", "assignee": "Jane Doe"}
  ],
  "next_meeting": "February 1, 2025"
}
```

### GET /ai-assistant/download/{task_id}

Download generated Meeting Minutes DOCX.

**Response:**
- DOCX file download

## Insider Trading Endpoints

### GET /api/insider-trading/enhanced-details

Detailed insider trading information with filters.

**Query Parameters:**
- `company` (string, optional): Filter by company name
- `depository` (string, optional): Filter by depository (CDSL, NSDL, PHY)

**Response:**
```json
{
  "summary": {
    "total_companies": 5,
    "total_investors": 100,
    "total_shares": 50000,
    "net_investors_change": 10,
    "net_shares_change": 5000,
    "added_count": 15,
    "removed_count": 5,
    "changed_count": 20,
    "unchanged_count": 60
  },
  "top_new_investors": [
    {
      "pangir": "ABCDE1234F",
      "name": "New Investor",
      "email": "investor@example.com",
      "position_latest": 1000,
      "position_older": 0,
      "position_difference": 1000,
      "status": "ADDED",
      "source": "Company A - CDSL"
    }
  ],
  "top_exits": [],
  "top_buyers": [],
  "top_sellers": []
}
```

### GET /api/insider-trading/filter-options

Available companies and depositories.

**Response:**
```json
{
  "companies": ["Company A", "Company B"],
  "depositories": ["CDSL", "NSDL"]
}
```

### GET /api/insider-trading/summary

Summary of insider trading data.

**Response:**
```json
{
  "total_companies": 5,
  "total_investors": 100,
  "total_shares": 50000,
  "net_investors_change": 10,
  "net_shares_change": 5000,
  "added_count": 15,
  "removed_count": 5,
  "changed_count": 20,
  "unchanged_count": 60
}
```

### GET /api/insider-trading/details

Detailed insider trading data.

**Response:**
```json
{
  "summary": {
    "total_companies": 5,
    "total_investors": 100,
    "total_shares": 50000,
    "net_investors_change": 10,
    "net_shares_change": 5000,
    "added_count": 15,
    "removed_count": 5,
    "changed_count": 20,
    "unchanged_count": 60
  },
  "top_new_investors": [],
  "top_exits": [],
  "top_buyers": [],
  "top_sellers": []
}
```

### GET /api/insider-trading/companies

List of companies with insider trading data.

**Response:**
```json
{
  "companies": ["Company A", "Company B"]
}
```

## Chatbot Endpoints

### POST /api/chat/message

Process a chat message and return response.

**Request:**
```json
{
  "message": "Show me recent SEBI filings",
  "session_id": "session-uuid",
  "database": "sebi",
  "limit": 10,
  "last_n_days": 30
}
```

**Response:**
```json
{
  "response": "Here are the recent SEBI filings...",
  "database_used": "sebi"
}
```

### POST /api/chat/stream

Stream chat responses for real-time interaction.

**Request:**
```json
{
  "message": "Show me recent SEBI filings",
  "session_id": "session-uuid",
  "database": "sebi",
  "limit": 10,
  "last_n_days": 30
}
```

**Response:**
- Streaming text response

## Visit Tracking Endpoints

### GET /visits/count

Get current visit count.

**Response:**
```json
{
  "count": 1234,
  "message": "Successfully retrieved visit count"
}
```

### POST /visits/increment

Increment visit count.

**Response:**
```json
{
  "success": true,
  "new_count": 1235,
  "message": "Successfully incremented visit count"
}
```

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "detail": "Invalid request parameters"
}
```

### 404 Not Found
```json
{
  "detail": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "detail": "Internal server error occurred"
}
```

## Data Models

### Director
```json
{
  "id": 1,
  "name": "John Smith",
  "din": "12345678"
}
```

### Company
```json
{
  "name": "Company A",
  "type": "Public Limited Company",
  "director_count": 5
}
```

### SEBI Filing
```json
{
  "id": 1,
  "date_key": "2025-01-01",
  "row_index": 1,
  "pdf_link": "https://example.com/document.pdf",
  "summary": "Summary of the filing",
  "inserted_at": "2025-01-01T00:00:00"
}
```

### BSE Alert
```json
{
  "id": 1,
  "date_key": "2025-01-01",
  "row_index": 1,
  "pdf_link": "https://example.com/alert.pdf",
  "summary": "Summary of the alert",
  "inserted_at": "2025-01-01T00:00:00",
  "entity_name": "Company A",
  "nature": "Regulatory Notice"
}
```

### RBI Notification
```json
{
  "id": 1,
  "date_key": "2025-01-01",
  "row_index": 1,
  "pdf_link": "https://example.com/notification.pdf",
  "summary": "Summary of the notification",
  "inserted_at": "2025-01-01T00:00:00"
}
```

### Meeting Place
```json
{
  "id": 1,
  "name": "Head Office",
  "address": "123 Business Street, City, Country",
  "is_default": true,
  "created_at": "2025-01-01T00:00:00"
}
```

### Visit Count
```json
{
  "count": 1234,
  "message": "Successfully retrieved visit count"
}
```

## Rate Limiting

The API implements basic rate limiting to prevent abuse. Excessive requests may result in HTTP 429 (Too Many Requests) responses.

## Versioning

The API version is currently v1. Future versions will be indicated in the URL path.

## Changelog

### v1.0.0 (2025-01-01)
- Initial release of the AEGIS Platform API
- Implemented all core endpoints for directors, regulatory data, analytics, meeting minutes, AI assistant, insider trading, chatbot, and visit tracking
