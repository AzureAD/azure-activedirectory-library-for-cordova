#!/bin/bash

# Implements logic to build https://github.com/AzureAD/azure-activedirectory-library-for-objc and produce required lib
# Usage: place this script to azure-activedirectory-library-for-ios repo root and run

# Read technical aspects of creating framework targeting both simulator and device here: http://stackoverflow.com/a/31126203
# 1. Build iOS framework for device. Codesigning is required by Xcode, "iPhone Developer" identity is enough.
# 2. Build iOS framework for simulator.
# 3. Use lipo to produce universal iOS framework from previous two. At this point the codesigning identity of 1 step is lost: universal framework binary "is not signed at all" but that is fine since "Consumer does not care".

BUILD_PATH="./build"
BUILD_CONFIGURATION="Release"
DISABLE_COVERAGE="GCC_GENERATE_TEST_COVERAGE_FILES=NO"
DISABLE_INSTRUMENT="GCC_INSTRUMENT_PROGRAM_FLOW_ARCS=NO"

proj="ADAL"
echo "Building $proj"
xcodebuild -workspace ADAL.xcworkspace -scheme $proj -configuration $BUILD_CONFIGURATION ARCHS="i386 x86_64" -sdk iphonesimulator VALID_ARCHS="i386 x86_64" ONLY_ACTIVE_ARCH=NO CONFIGURATION_BUILD_DIR="../build/emulator" clean build $DISABLE_COVERAGE $DISABLE_INSTRUMENT
xcodebuild -workspace ADAL.xcworkspace -scheme $proj -configuration $BUILD_CONFIGURATION ARCHS="armv7 armv7s arm64" -sdk iphoneos VALID_ARCHS="armv7 armv7s arm64" CONFIGURATION_BUILD_DIR="../build/device" clean build $DISABLE_COVERAGE $DISABLE_INSTRUMENT

echo "Creating universal version of $proj"
rm -rf "$BUILD_PATH/$proj.framework"
# Initial framework structure (to be updated later)
cp -R "$BUILD_PATH/emulator/$proj.framework" "$BUILD_PATH/$proj.framework"
# signature is not valid as we are going to replace lib file => remove it
rm -rf "$BUILD_PATH/$proj.framework/_CodeSignature"

simulatorFrameworkPath="$BUILD_PATH/emulator/$proj.framework/$proj"
deviceFrameworkPath="$BUILD_PATH/device/$proj.framework/$proj"
universalFrameworkPath="$BUILD_PATH/$proj.framework/$proj"

lipo "$simulatorFrameworkPath" "$deviceFrameworkPath" -create -output "$universalFrameworkPath"
lipo -info "$universalFrameworkPath"

# PS. There are no resources to take care about anymore, storyboards are gone (https://github.com/AzureAD/azure-activedirectory-library-for-objc/pull/477)

echo "Done: '$BUILD_PATH/$proj.framework'"
