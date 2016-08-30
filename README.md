# site-montdenis

[![Build Status](https://travis-ci.org/ViBiOh/site-montdenis.svg?branch=master)](https://travis-ci.org/ViBiOh/site-montdenis) [![](https://badge.imagelayers.io/vibioh/site-montdenis:latest.svg)](https://imagelayers.io/?images=vibioh/site-montdenis:latest 'Get your own badge on imagelayers.io')

Personal website

## Travis Deploy configuration

```bash
ssh-keygen -t rsa -b 4096 -C '${REPO_NAME}@travis-ci.org' -f ./deploy_rsa
travis login --github-token ${GITHUB_TOKEN}
travis encrypt-file deploy_rsa --add
ssh-copy-id -i deploy_rsa.pub ${SSH_USER}@${SSH_HOST}
rm -f deploy_rsa deploy_rsa.pub
git add deploy_rsa.enc .travis.yml
```