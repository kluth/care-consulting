# ADR-0012: Certificate Generation Strategy

## Status

Accepted

## Date

2026-01-16

## Context

We need to generate "Official" PDF certificates when a user completes a course. The solution must be secure (server-side), customizable, and performant.

## Research Findings

- **Client-side (jsPDF):** Insecure. Users can manipulate the browser state to fake certificates.
- **Headless Browser (Puppeteer):** Very high resource usage (RAM/CPU) for generating simple PDFs.
- **PDFKit (Node.js):** Lightweight, fast, programmatic generation of text/images. Industry standard for backends.

## Decision

We will use **PDFKit**.

## Rationale

PDFKit allows us to generate a PDF stream directly from the NestJS controller to the client without writing files to disk (stateless) or spinning up a heavy browser instance. It offers precise layout control for professional-looking certificates.

## Consequences

- **Positive:** Fast, low overhead, secure.
- **Negative:** Layouts are coded (x,y coordinates), not HTML/CSS, which makes visual changes slower than HTML-based generators.
