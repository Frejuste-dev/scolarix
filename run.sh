#!/bin/bash
cd backend && python -m uvicorn main:app --host localhost --port 8000 &
cd frontend && npm run dev
