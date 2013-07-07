#!/usr/bin/env bash

PINESHA=`cat .git/ORIG_HEAD`
echo "Pine SHA:   ${PINESHA}"

ORIGINSHA=`/usr/bin/git ls-remote origin -h refs/heads/master`
ORIGINSHA=`./split.js "${ORIGINSHA}"`
echo "Origin SHA: ${ORIGINSHA}"

if [ "${PINESHA}" != "${ORIGINSHA}" ]; then
    /usr/bin/git pull

    if [ $? == 0 ]; then
        #sudo /sbin/shutdown -a -r 0
        echo "fake reboot"
    else
        echo "uh-oh."
    fi

else
    echo "abort"
fi
