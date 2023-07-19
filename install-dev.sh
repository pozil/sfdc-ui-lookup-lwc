#!/bin/bash

ORG_ALIAS="lookup-lwc"
if [ "$#" -eq 1 ]; then
  ORG_ALIAS="$1"
fi

echo ""
echo "Installing org with alias: $ORG_ALIAS"
echo ""

echo "Cleaning previous scratch org..."
sf org delete scratch -p -o $ORG_ALIAS &> /dev/null
echo ""

echo "Creating scratch org..." && \
sf org create scratch -f config/project-scratch-def.json -a $ORG_ALIAS -d -y 30 && \
echo "" && \

echo "Pushing source..." && \
sf project deploy start && \
echo "" && \

echo "Opening sample app..." && \
sf org open -p /c/SampleLookupApp.app
EXIT_CODE="$?"

# Check exit code
echo ""
if [ "$EXIT_CODE" -eq 0 ]; then
    echo "Installation completed."
else
    echo "Installation failed."
fi
exit $EXIT_CODE
