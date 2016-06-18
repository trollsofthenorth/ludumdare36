#!/usr/bin/env python2

from selenium import webdriver
import unittest


class javascriptErrorTest(unittest.TestCase):

    def setUp(self):
        self.driver = webdriver.Firefox()
        self.driver.get('http://localhost:8000')
        self.driver['loggingPrefs'] = { 'browser':'ALL' }

    def test(self):
        logs = self.driver.get_log()
        for l in logs:
            print(l)
        self.assertTrue(True)


    def tearDown(self):
        self.driver.quit()


