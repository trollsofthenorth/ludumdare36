#!/usr/bin/env python2

from selenium import webdriver
import unittest


class javascriptErrorTest(unittest.TestCase):

    def setUp(self):
        self.driver = webdriver.Firefox()
        self.driver.get('http://www.google.com')

    def test(self):
        logs = self.driver.get_log('client')
        for l in logs:
            print(l)
        self.assertTrue(true)


    def tearDown(self):
        self.driver.quit()


