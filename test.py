#!/usr/bin/env python3

import threading
import unittest
import http.server
import socketserver
import sys
import urllib.request
from selenium import webdriver
from xvfbwrapper import Xvfb

class TestJavascript(unittest.TestCase):

    def setUp(self):

        # Configure a web service.
        handler = http.server.SimpleHTTPRequestHandler
        address = ('127.0.0.1', 9999)
        socketserver.TCPServer.allow_reuse_address = True # Prevents address conflicts.
        httpd = socketserver.TCPServer(address, handler)

        # Start the web service in a separate thread as deamon.
        httpd_thread = threading.Thread(target=httpd.serve_forever)
        httpd_thread.setDaemon(True)
        httpd_thread.start()

        # Start a display.
        self.display = Xvfb()
        self.display.start() 

        # Start the browser driver for selenium testing.
        self.driver = webdriver.Firefox()
        self.driver.get('http://localhost:9999/index.html')

    def test_javascript(self):

        # Create an instance of the selenium Firefox driver.
        error = self.driver.find_elements_by_id('error')[0].text
        self.assertEqual(error, '')

    def tearDown(self):
        self.display.stop()

if __name__ == '__main__':
    unittest.main()
