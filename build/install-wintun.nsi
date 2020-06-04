RequestExecutionLevel admin

!macro customInstall
  File "${BUILD_RESOURCES_DIR}\wintun-amd64.msi"
  File "${BUILD_RESOURCES_DIR}\myst_supervisor.exe"

  DetailPrint "Installing Wintun driver..."
  ExecWait '"msiexec" /i "$INSTDIR\wintun-amd64.msi" /qn /log wintun-install.log' $0
  MessageBox MB_OK "driver: $0"

  DetailPrint "Installing supervisor service..."
  nsExec::ExecToStack '"$INSTDIR\myst_supervisor.exe" --install' $0
  Pop $0
  Pop $1
  MessageBox MB_OK "supervisor: $0"
  MessageBox MB_OK "supervisor output: $1"

  DetailPrint "Installing supervisor service2..."
  ExecWait '"$INSTDIR\myst_supervisor.exe" --install' $0
  MessageBox MB_OK "supervisor2: $0"
!macroend

!macro customUnInstall
  DetailPrint "Uninstalling Wintun driver..."
  ExecWait '"msiexec" /x "$INSTDIR\wintun-amd64.msi" /qn' $0
  MessageBox MB_OK "driver: $0"

  DetailPrint "Uninstalling supervisor service..."
  ExecWait '"$INSTDIR\myst_supervisor.exe" --uninstall' $0
  MessageBox MB_OK "supervisor: $0"
!macroend