@echo off
echo --------------- START BUILD -----------------


rem 
call build.bat app.js
rem call build.bat index.js
rem call build.bat listsub.js
rem call build.bat login.js
rem 
call build.bat menu.js
rem call build.bat register.js


echo ---------------------------------------------
echo    BUILD SUCCESS
echo ---------------------------------------------
pause