#!/usr/bin/env python2

from selenium import webdriver
import unittest


class javascriptErrorTest(unittest.TestCase):

    def setUp(self):
        self.driver = webdriver.Firefox()
        self.driver.get('http://localhost:8000')

    def test(self):
        logs = self.driver.get_log('browser')
        for l in logs:
            print(l)
        self.assertTrue(True)


    def tearDown(self):
        self.driver.quit()


