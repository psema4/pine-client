#!/usr/bin/env bash

PINESHA=`cat .git/ORIG_HEAD`
echo "Pine SHA:   ${PINESHA}"

ORIGINSHA=`/usr/bin/git ls-remote origin -h refs/heads/master`
ORIGINSHA=`./split.js "${ORIGINSHA}"`
echo "Origin SHA: ${ORIGINSHA}"

if [ "${PINESHA}" != "${ORIGINSHA}" ]; then
    /usr/bin/git pull

    if [ $? == 0 ]; then
        sudo /sbin/shutdown -a -r 0
        exit 0

    else
        echo "uh-oh."
        exit 2
    fi

else
    echo "abort"
    exit 1
fi
