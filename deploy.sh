#!/usr/bin/env bash
spawn ssh "$DEPLOY_USER"@"$DEPLOY_ADDRESS" << EOF
	uname -a
	pwd
	ls
EOF
expect "Password:"
send "$DEPLOY_PASSWORD\r"
interact
