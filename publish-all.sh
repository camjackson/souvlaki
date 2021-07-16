#!/bin/bash

set -euxo pipefail

echo 'Publishing souvlaki 🌯'
cd packages/souvlaki
./publish.sh
cd ../..
echo 'Published 1/3!'

echo 'Publishing souvlaki-apollo 🌯🚀'
cd packages/souvlaki-apollo
./publish.sh
cd ../..
echo 'Published 2/3!'

echo 'Publishing souvlaki-react-router 🌯🧭'
cd packages/souvlaki-react-router
./publish.sh
cd ../..
echo 'Published 3/3!'

echo '✅ All done! ✅'
