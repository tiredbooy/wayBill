#define MyAppName "Waybill"
#define MyAppVersion "1.0.0"
#define MyAppPublisher "Softdash"

#define RootDir ".."

[Setup]

AppId={{B9190081-B48A-4815-B72B-FF141E36CEC4}

AppName={#MyAppName}
AppVersion={#MyAppVersion}
AppPublisher={#MyAppPublisher}

DefaultDirName={autopf}\Waybill

OutputDir={#RootDir}\release
OutputBaseFilename=WaybillSetup

Compression=lzma2
SolidCompression=yes

WizardStyle=modern

PrivilegesRequired=admin

SetupIconFile={#SourcePath}icon.ico

ArchitecturesAllowed=x64compatible
ArchitecturesInstallIn64BitMode=x64compatible


[Files]

Source: "{#RootDir}\build\bin\waybill.exe"; DestDir: "{app}"; Flags: ignoreversion
Source: "{#SourcePath}icon.ico"; DestDir: "{app}"


[Icons]

Name: "{autoprograms}\Waybill"; Filename: "{app}\waybill.exe"

Name: "{autodesktop}\Waybill"; Filename: "{app}\waybill.exe"


[Run]

Filename: "{app}\waybill.exe"; Description: "Launch Waybill"; Flags: nowait postinstall skipifsilent