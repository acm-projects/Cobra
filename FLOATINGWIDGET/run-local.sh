#!/bin/bash

# Set the OpenAI API key
export OPENAI_API_KEY="OPEN_AI_API_KEY_GOES_HERE"

# Change to the leetcode-analyzer directory
cd leetcode-analyzer

# Run the serverless function locally
npx serverless offline 