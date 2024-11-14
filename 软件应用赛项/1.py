#coding:utf-8
import requests
def a():
    url = 'http://moot.mhys.com.cn/#/login'
    "username":"2",
    "password":"4"
response = requests.get(a)
if response.status_code == 200:
    data = response.json()
filename = 'output.txt'
with open(filename, 'w', encoding='utf-8') as file:
    file.write(json_str)
    print("保存成功")