RequestExecutionLevel admin

!macro customInstall
  File "${BUILD_RESOURCES_DIR}\nsis\wintun-amd64.msi"

  DetailPrint "Installing Wintun driver..."
  nsExec::ExecToStack '"msiexec" /i "$INSTDIR\wintun-amd64.msi" /qn'
  Pop $0
  Pop $1
  ${ifNot} $0 == 0
    MessageBox MB_OK `Wintun driver install failed with (error $0).$\r$\n$\r$\n$1`
  ${endif}

  DetailPrint "Installing Supervisor service..."
  nsExec::ExecToStack '"$INSTDIR\resources\static\bin\myst_supervisor.exe" --install'
  Pop $0
  Pop $1
  ${ifNot} $0 == 0
    MessageBox MB_OK `Supervisor service install failed (error $0).$\r$\n$\r$\n$1`
  ${endif}
!macroend

!macro customRemoveFiles
  DetailPrint "Uninstalling Wintun driver..."
  nsExec::ExecToStack '"msiexec" /x "$INSTDIR\wintun-amd64.msi" /qn'
  Pop $0
  Pop $1
  ${ifNot} $0 == 0
    MessageBox MB_OK `Wintun driver uninstall failed (error $0).$\r$\n$\r$\n$1`
  ${endif}

  DetailPrint "Uninstalling supervisor service..."
  nsExec::ExecToStack '"$INSTDIR\resources\static\bin\myst_supervisor.exe" --uninstall'
  Pop $0
  Pop $1
  ${ifNot} $0 == 0
    MessageBox MB_OK `Supervisor service uninstall failed (error $0).$\r$\n$\r$\n$1`
  ${endif}

  RMDir /r $INSTDIR
!macroend