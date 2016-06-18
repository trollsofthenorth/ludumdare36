#!/usr/bin/env python2

from selenium import webdriver
import unittest


class javascriptErrorTest(unittest.TestCase):

    def setUp(self):
        self.driver = webdriver.Firefox()
        self.driver.get('http://localhost:8000/index.html')

    def test(self):
        log_types = ('browser', 'driver', 'client', 'server')

        for i in log_types:
            print('====== %s =====' % i)
            for l in self.driver.get_log(i):
                print(l['message'])

        self.assertTrue(True)


    def tearDown(self):
        self.driver.quit()


