@echo off
echo --------------- START BUILD -----------------


call build.bat app.js
call build.bat index.js
call build.bat listsub.js
call build.bat login.js
call build.bat menu.js
call build.bat register.js


echo ---------------------------------------------
echo    BUILD SUCCESS
echo ---------------------------------------------
pause