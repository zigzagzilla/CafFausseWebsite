#!/bin/bash

echo "Building React frontend..."
npx vite build

echo "Starting Flask server..."
python run.py
