RequestExecutionLevel admin

!macro customInstall
  File "/oname=$INSTDIR\resources\static\bin\wintun.dll" "${BUILD_RESOURCES_DIR}\nsis\wintun.dll"

  DetailPrint "Installing Supervisor service..."
  nsExec::ExecToStack '"$INSTDIR\resources\static\bin\myst_supervisor.exe" --install --uid "0"'
  Pop $0
  Pop $1
  ${ifNot} $0 == 0
    MessageBox MB_OK `Supervisor service install failed (error $0).$\r$\n$\r$\n$1`
  ${endif}
!macroend

!macro customRemoveFiles

  DetailPrint "Uninstalling supervisor service..."
  nsExec::ExecToStack '"$INSTDIR\resources\static\bin\myst_supervisor.exe" --uninstall'
  Pop $0
  Pop $1
  ${ifNot} $0 == 0
    MessageBox MB_OK `Supervisor service uninstall failed (error $0).$\r$\n$\r$\n$1`
  ${endif}

  RMDir /r $INSTDIR
!macroend
