#!/bin/bash

set -e

if [ ! -f .env ]; then cp ./env.example .env; fi

clear
npm run start -- $@
