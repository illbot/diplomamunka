#!/bin/sh

export GOOGLE_APPLICATION_CREDENTIALS="./service_acc.json"
export GOOGLE_CLOUD_PROJECT=fitnessapp-7a114

python3 upload_foods_from_csv.py 