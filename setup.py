from setuptools import setup, find_packages
import os

version = '0.1.0'

setup(name='collective.requirejs',
      version=version,
      description="Add requirejs to the plone scripts",
      long_description=open("README.txt").read() + "\n" +
                       open(os.path.join("docs", "HISTORY.txt")).read(),
      # Get more strings from
      # http://pypi.python.org/pypi?:action=list_classifiers
      classifiers=[
        "Programming Language :: Python",
        ],
      keywords='requirejs js plone',
      author='Patrick Gerken',
      author_email='do3cc@patrick-gerken.de',
      url='http://do3.cc',
      license='BSD GPL MIT',
      packages=find_packages(exclude=['ez_setup']),
      namespace_packages=['collective'],
      include_package_data=True,
      zip_safe=False,
      install_requires=[
          'setuptools',
          # -*- Extra requirements: -*-
      ],
      entry_points="""
      # -*- Entry points: -*-
      [z3c.autoinclude.plugin]
      target = plone

      """,
      )
