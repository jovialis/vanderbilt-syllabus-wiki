echo 'Building SHARED'
yarn workspace shared build

echo "$BUILD_TARGET"

if [ "$BUILD_TARGET" = "backend" ]
then
  echo 'Building BACKEND'
  yarn workspace backend run build
fi

if [ "$BUILD_TARGET" = "frontend" ]
then
  echo 'Building FRONTEND'
  yarn workspace frontend run build
fi

exit