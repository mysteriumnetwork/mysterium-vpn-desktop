#!/usr/bin/env bash

log_file="./bundle.log"
app_dir=deploy/darwin/build/MysteriumVPN.app
identity=14D1483DEFD2A449D35CC443621E3D0FEDF3972E
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
rm -rf "${app_dir}" "${log_file}"
check_success

printf "# Packing"
npx nodegui-packer --pack dist &>> "${log_file}"
check_success

printf "# Signing"
codesign --verbose=4 --deep --strict --timestamp --sign "${identity}" --entitlements "${entitlements}" --options "runtime" ${app_dir} &>> "${log_file}"
check_success

printf "# Verifying (codesign)"
codesign --verbose=4 --deep --verify "${app_dir}" &>> "${log_file}"
check_success

printf "# Verifying (gatekeeper)"
spctl -a -vvvv "${app_dir}" &>> "${log_file}"
check_success

echo "Complete: ${app_dir}"
echo "Bundle log: ${log_file}"
