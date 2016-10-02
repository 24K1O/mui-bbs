@echo off  
if exist %~dpnx1 (  
	echo  start buiding %1% .......
	java -jar %~dp0jsc.jar --js_output_file %~dp0/min/%~n1.min%~x1 --js %~nx1 
	echo  buiding %1% successful !
) else (
	echo file does not exist: "%~dpnx1"  
)  
rem --create_source_map %~n1.min.map