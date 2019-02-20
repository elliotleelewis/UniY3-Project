#!/usr/bin/env bash
sshpass -p $DEPLOY_PASSWORD ssh "$DEPLOY_USER"@"$DEPLOY_ADDRESS" << EOF
	uname -a
	pwd
	ls
EOF
