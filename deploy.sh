#!/usr/bin/env bash
sshpass -p $DEPLOY_PASSWORD ssh -o StrictHostKeyChecking=no $DEPLOY_USER@$DEPLOY_ADDRESS "echo \$HOME"
#uname -a
#pwd
#ls
