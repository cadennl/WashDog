import os
import urllib
import socket
import socket

# listener socket will wait for input from plugin client
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

host = socket.gethostname()
port = 6969
s.bind((host, port))
print(host)
