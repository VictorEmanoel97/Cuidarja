Set shell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")

'O Observador.vbs é um inicializador automático. Ele ativa o watcher de monitoramento em segundo plano e abre o projeto no VSCode, tornando o processo mais prático.
'Ela foi feito para Victor e Natan no Front.
root = fso.GetParentFolderName(WScript.ScriptFullName)
shell.CurrentDirectory = root

shell.Popup "Inicializando módulos...", 1, "Observador", 64
shell.Run "cmd /c node scripts\build\watcher.js", 0, False

shell.Popup "Abrindo interface...", 1, "Observador", 64
shell.Run "code .", 1, False

shell.Popup "Ambiente pronto.", 3, "...", 64