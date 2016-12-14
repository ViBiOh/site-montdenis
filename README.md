# site-montdenis

[![Build Status](https://travis-ci.org/ViBiOh/site-montdenis.svg?branch=master)](https://travis-ci.org/ViBiOh/site-montdenis) [![](https://images.microbadger.com/badges/image/vibioh/site-montdenis.svg)](https://microbadger.com/images/vibioh/site-montdenis "Get your own image badge on microbadger.com")

[Personal website](https://pension-montdenis.fr)

## Travis Deploy configuration

```bash
ssh-keygen -t rsa -b 4096 -C '${REPO_NAME}@travis-ci.org' -f ./deploy_rsa
travis login --github-token ${GITHUB_TOKEN}
travis encrypt-file deploy_rsa --add
ssh-copy-id -i deploy_rsa.pub ${SSH_USER}@${SSH_HOST}
rm -f deploy_rsa deploy_rsa.pub
git add deploy_rsa.enc .travis.yml
```
