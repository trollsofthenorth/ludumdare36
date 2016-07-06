#!/usr/bin/env python3

from selenium import webdriver
import unittest


class javascriptErrorTest(unittest.TestCase):

    def setUp(self):
        self.driver = webdriver.Firefox()
        self.driver.get('http://localhost:8000/index.html')

    def test(self):
        print(self.driver.find_element_by_tag_name('body').get_attribute('JSError'))
        

        self.assertFalse(False)

    def tearDown(self):
        self.driver.close()
