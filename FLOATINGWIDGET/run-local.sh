#!/bin/bash

# Set the OpenAI API key
export OPENAI_API_KEY="insert-your-openai-api-key-here"

# Change to the leetcode-analyzer directory
cd leetcode-analyzer

# Run the serverless function locally
npx serverless offline 