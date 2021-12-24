#!/usr/bin/env bash

gunicorn run:app --bind 0.0.0.0:$PORT --log-level=debug --workers=1