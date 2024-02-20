#!/bin/bash

bash nvm.sh

script_dir=$(dirname "$0")

bash $script_dir/pip.sh
bash $script_dir/pnpm.sh