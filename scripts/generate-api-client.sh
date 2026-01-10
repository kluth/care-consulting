#!/bin/bash
# Generate TypeScript client from OpenAPI spec
npx openapi-generator-cli generate \
  -i http://localhost:3000/api-json \
  -g typescript-angular \
  -o libs/shared/data-access/src/lib/generated \
  --additional-properties=ngVersion=18,providedInRoot=true
