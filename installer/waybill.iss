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
Source: "{#RootDir}\build\windows\installer\tmp\MicrosoftEdgeWebview2Setup.exe"; DestDir: "{tmp}"; Flags: deleteafterinstall


[Icons]

Name: "{autoprograms}\Waybill"; Filename: "{app}\{#MyAppExeName}"; WorkingDir: "{app}"; IconFilename: "{app}\icon.ico"

Name: "{autodesktop}\Waybill"; Filename: "{app}\{#MyAppExeName}"; WorkingDir: "{app}"; IconFilename: "{app}\icon.ico"; Tasks: desktopicon


[Tasks]

Name: "desktopicon"; Description: "Create a desktop shortcut"; GroupDescription: "Additional shortcuts:"; Flags: unchecked


[Run]

Filename: "{tmp}\MicrosoftEdgeWebview2Setup.exe"; Parameters: "/silent /install"; StatusMsg: "Installing Microsoft WebView2 Runtime..."; Flags: waituntilterminated; Check: not IsWebView2RuntimeInstalled
Filename: "{app}\{#MyAppExeName}"; Description: "Launch Waybill"; WorkingDir: "{app}"; Flags: nowait postinstall skipifsilent runasoriginaluser


[Code]

function IsValidWebView2Version(const Version: String): Boolean;
begin
  Result := (Version <> '') and (CompareText(Version, '0.0.0.0') <> 0);
end;

function IsWebView2RuntimeInstalled: Boolean;
var
  Version: String;
begin
  { Microsoft documents the machine-wide 64-bit runtime in WOW6432Node. }
  if RegQueryStringValue(
    HKLM,
    'SOFTWARE\WOW6432Node\Microsoft\EdgeUpdate\Clients\{{F3017226-FE2A-4295-8BDF-00C3A9A7E4C5}',
    'pv',
    Version
  ) and IsValidWebView2Version(Version) then
  begin
    Result := True;
    Exit;
  end;

  { WebView2 can also be installed only for the current user. }
  Result := RegQueryStringValue(
    HKCU,
    'Software\Microsoft\EdgeUpdate\Clients\{{F3017226-FE2A-4295-8BDF-00C3A9A7E4C5}',
    'pv',
    Version
  ) and IsValidWebView2Version(Version);
end;
