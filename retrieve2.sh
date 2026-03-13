#!/bin/bash
git log --all --oneline | grep "Fix: Make Offline" | cut -d' ' -f1
