# Iot-Data-Platform

## Gateway/backend/bin/www 수정
포트 수정 => Docker: 5000, Windows: 6007

## MySql 사용자 추가
CREATE user 'iot'@'localhost' IDENTIFIED BY 'Sct91234!'; 
GRANT ALL PRIVILEGES ON *.* TO 'iot'@'localhost'; 
grant all privileges on gateway.* to 'iot'@'localhost'; 
