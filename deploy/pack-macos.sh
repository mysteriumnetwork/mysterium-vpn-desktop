#!/usr/bin/env bash

log_file="./bundle.log"
target_app=deploy/darwin/build/MysteriumVPN.app
target_dir=deploy/darwin/build
# Find identity using:
# security find-identity -p codesigning
identity="Tadas Krivickas"
entitlements="deploy/darwin/MysteriumVPN.app/Contents/Resources/entitlements.plist"

function check_success() {
    if [[ $? == 0 ]]; then
        printf " ✅\n"
    else
        printf " ❌\n"
        echo "Log file: ${log_file}"
        exit 1
    fi
}

printf "# Cleaning"
rm -rf "${target_app}" "${log_file}"
check_success

printf "# Packing"
npx nodegui-packer --pack dist &>> "${log_file}"
check_success

printf "# Signing"
codesign --verbose=4 --deep --strict --timestamp --sign "${identity}" --entitlements "${entitlements}" --options "runtime" ${target_app} &>> "${log_file}"
check_success

printf "# Verifying (codesign)"
codesign --verbose=4 --deep --verify "${target_app}" &>> "${log_file}"
check_success

printf "# Verifying (gatekeeper)"
spctl -a -vvvv "${target_app}" &>> "${log_file}"
check_success

printf "# Building DMG image"
npx create-dmg --overwrite --identity="${identity}" "${target_app}" "${target_dir}" &>> "${log_file}"
check_success

echo "Done! Artifacts can be found in: ${target_dir}"
echo "Bundle log: ${log_file}"
