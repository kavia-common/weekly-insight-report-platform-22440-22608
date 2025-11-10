#!/bin/bash
cd /home/kavia/workspace/code-generation/weekly-insight-report-platform-22440-22608/web
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

