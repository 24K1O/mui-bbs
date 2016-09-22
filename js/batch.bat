@echo off
echo --------------- START BUILD -----------------


call build.bat app.js
call build.bat index.js
call build.bat menu.js


echo ---------------------------------------------
echo    BUILD SUCCESS
echo ---------------------------------------------
pause