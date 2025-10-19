#!/bin/bash

# Activate virtual environment
source backend/venv/bin/activate

# Create a test user with a known password
python backend/manage.py shell <<EOF
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(email='user@example.com').exists():
    User.objects.create_superuser('user@example.com', 'password')
EOF

# Load the rest of the fixture data
python backend/manage.py loaddata backend/financeiro/fixtures/test_data.json
