$frontend = "C:\Users\samla\Downloads\helloo-main\helloo-main\frontend"
$p = Start-Process -FilePath "node.exe" -ArgumentList "node_modules\next\dist\bin\next","dev","-p","3000" -WorkingDirectory $frontend -NoNewWindow -PassThru -RedirectStandardOutput "$frontend\.server.log" -RedirectStandardError "$frontend\.server2.log"
Write-Output $p.Id
