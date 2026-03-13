#!/bin/bash
git log --all --oneline | grep "Feat: Add offline downloads functionality for PWA using IndexedDB" | cut -d' ' -f1
