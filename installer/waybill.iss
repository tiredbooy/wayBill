#define MyAppName "Waybill"
#ifndef MyAppVersion
  #define MyAppVersion "1.0.0"
#endif
#define MyAppPublisher "Softdash"
#define MyAppExeName "waybill.exe"

#define RootDir ".."

[Setup]

AppId={{B9190081-B48A-4815-B72B-FF141E36CEC4}

AppName={#MyAppName}
AppVersion={#MyAppVersion}
AppPublisher={#MyAppPublisher}
AppVerName={#MyAppName} {#MyAppVersion}
VersionInfoVersion={#MyAppVersion}

DefaultDirName={autopf}\Waybill
DefaultGroupName=Waybill
DisableProgramGroupPage=yes

OutputDir={#RootDir}\release
OutputBaseFilename=WaybillSetup-{#MyAppVersion}

Compression=lzma2
SolidCompression=yes

WizardStyle=modern

PrivilegesRequired=admin
PrivilegesRequiredOverridesAllowed=dialog
MinVersion=10.0
SetupLogging=yes
CloseApplications=force
RestartApplications=no

SetupIconFile={#SourcePath}icon.ico
UninstallDisplayIcon={app}\{#MyAppExeName}
LicenseFile={#SourcePath}license.txt
WizardImageFile={#SourcePath}wizard.bmp
WizardSmallImageFile={#SourcePath}wizard-small.bmp

ArchitecturesAllowed=x64compatible
ArchitecturesInstallIn64BitMode=x64compatible


[Files]

Source: "{#RootDir}\build\bin\{#MyAppExeName}"; DestDir: "{app}"; Flags: ignoreversion
Source: "{#SourcePath}icon.ico"; DestDir: "{app}"


[Icons]

Name: "{autoprograms}\Waybill"; Filename: "{app}\{#MyAppExeName}"; WorkingDir: "{app}"; IconFilename: "{app}\icon.ico"

Name: "{autodesktop}\Waybill"; Filename: "{app}\{#MyAppExeName}"; WorkingDir: "{app}"; IconFilename: "{app}\icon.ico"; Tasks: desktopicon


[Tasks]

Name: "desktopicon"; Description: "Create a desktop shortcut"; GroupDescription: "Additional shortcuts:"; Flags: unchecked


[Run]

Filename: "{app}\{#MyAppExeName}"; Description: "Launch Waybill"; WorkingDir: "{app}"; Flags: nowait postinstall skipifsilent
