# Wellness & Burnout Prevention Module

## Overview
Based on [ADR-0018](./adr/0018-wellness-burnout-prevention.md), this module focuses on the mental well-being of healthcare workers. Given the high stress environment, the platform provides tools for early detection and prevention of burnout.

## Features

### 1. Daily Check-ins
A low-friction way for users to track their emotional state.
- **Mood Scale:** 1-5 (Terrible to Great)
- **Stress Level:** 1-5 (Relaxed to Overwhelmed)
- **Time Commitment:** < 30 seconds

### 2. Burnout Risk Assessment (CBI)
A quarterly assessment based on the Copenhagen Burnout Inventory.
- Measures personal, work-related, and client-related burnout.
- Provides historical trend tracking.

### 3. Micro-interventions
A curated library of short exercises:
- Breathing techniques
- Physical stretches
- Mindfulness moments

## Privacy & Ethics
- Individual mood data is **NEVER** shared with facility managers.
- Managers only see anonymized, aggregated team data (minimum 5 participants required to show data).
- Users can opt-out at any time.

## Database Schema
The module uses the following Prisma models:
- `WellnessCheckIn`: Stores daily mood and stress levels.
- `BurnoutAssessment`: Stores quarterly CBI results.
