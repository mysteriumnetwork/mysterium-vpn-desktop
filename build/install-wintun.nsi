!macro customInstall
  DetailPrint "Installing Wintun..."
  File "${BUILD_RESOURCES_DIR}\wintun-amd64.msi"

  ExecWait '"msiexec" /i "$INSTDIR\wintun-amd64.msi" /qn /log wintun-install.log'
  Pop $R0 # return value/error/timeout
!macroend

!macro customUnInstall
  DetailPrint "Uninstalling Wintun..."
  ExecWait '"msiexec" /x "$INSTDIR\wintun-amd64.msi" /passive'
  Pop $R0 # return value/error/timeout
!macroend