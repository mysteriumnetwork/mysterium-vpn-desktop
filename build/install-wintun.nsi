RequestExecutionLevel admin

!macro customInstall
  File "${BUILD_RESOURCES_DIR}\wintun-amd64.msi"

  DetailPrint "Installing Wintun driver..."
  nsExec::ExecToStack '"msiexec" /i "$INSTDIR\wintun-amd64.msi" /qn /log wintun-install.log' $0
  Pop $0
  Pop $1
  MessageBox MB_OK "driver: $0"
  MessageBox MB_OK "driver output: $1"

  DetailPrint "Installing supervisor service..."
  nsExec::ExecToStack '"$INSTDIR\resources\static\bin\myst_supervisor.exe" --install' $0
  Pop $0
  Pop $1
  MessageBox MB_OK "supervisor: $0"
  MessageBox MB_OK "supervisor output: $1"

  DetailPrint "Installing supervisor service2..."
  ExecWait '"$INSTDIR\resources\static\bin\myst_supervisor.exe" --install' $0
  MessageBox MB_OK "supervisor2: $0"
!macroend

!macro customRemoveFiles
  DetailPrint "Uninstalling Wintun driver..."
  nsExec::ExecToStack '"msiexec" /x "$INSTDIR\wintun-amd64.msi" /qn' $0
  Pop $0
  Pop $1
  MessageBox MB_OK "driver: $0"
  MessageBox MB_OK "driver output: $1"

  DetailPrint "Uninstalling supervisor service..."
  nsExec::ExecToStack '"$INSTDIR\resources\static\bin\myst_supervisor.exe" --uninstall' $0
  Pop $0
  Pop $1
  MessageBox MB_OK "supervisor: $0"
  MessageBox MB_OK "supervisor output: $1"

  #RMDir /r $INSTDIR
!macroend