#!/usr/bin/env bash

set -e

app_dir=deploy/darwin/build/MysteriumVPN.app
identity=14D1483DEFD2A449D35CC443621E3D0FEDF3972E

rm -rf "${app_dir}"

npx nodegui-packer --pack dist
rm "${app_dir}/Contents/Frameworks/.gitkeep"
rm "${app_dir}/Contents/PlugIns/.gitkeep"
rm "${app_dir}/Contents/SharedFrameWorks/.gitkeep"

echo "### Signing"

codesign --verbose --force --sign "${identity}" "${app_dir}/Contents/PlugIns/platforms/libqcocoa.dylib"
codesign --verbose --force --sign "${identity}" "${app_dir}/Contents/PlugIns/printsupport/libcocoaprintersupport.dylib"
codesign --verbose --force --sign "${identity}" "${app_dir}/Contents/PlugIns/styles/libqmacstyle.dylib"
codesign --verbose --force --sign "${identity}" "${app_dir}/Contents/PlugIns/imageformats/libqgif.dylib"
codesign --verbose --force --sign "${identity}" "${app_dir}/Contents/PlugIns/imageformats/libqico.dylib"
codesign --verbose --force --sign "${identity}" "${app_dir}/Contents/PlugIns/imageformats/libqjpeg.dylib"
codesign --verbose --force --sign "${identity}" "${app_dir}/Contents/Frameworks/QtCore.framework"
codesign --verbose --force --sign "${identity}" "${app_dir}/Contents/Frameworks/QtGui.framework"
codesign --verbose --force --sign "${identity}" "${app_dir}/Contents/Frameworks/QtWidgets.framework"
codesign --verbose --force --sign "${identity}" "${app_dir}/Contents/Frameworks/QtDBus.framework"
codesign --verbose --force --sign "${identity}" "${app_dir}/Contents/Frameworks/QtPrintSupport.framework"
codesign --verbose --force --sign "${identity}" "${app_dir}/Contents/MacOs/qode"
codesign --verbose --force --sign "${identity}" "${app_dir}"

echo "### Verifying"

codesign --verbose --verify deploy/darwin/build/MysteriumVPN.app
