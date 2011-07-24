Introduction
============

Require.js is a library that allows you to define the dependencies of 
your code in javascript.
The library then loads the required files.
Please see the original documentation for more details::
http://requirejs.org/

Plone Integration
=================
Require.js usually loads files relative to the document base.
This would create unwieldy requirement statements.
Instead we load two scripts. One sets the configuration for require.js
to look for scripts in the ++resource++collective.requirejs, the other
is the require.js library itself.
The idea is to load resources from the resource directory named
++resource++collective.requirejs, providing as many javascript
libaries in that directory as possible.
require.js allows one to bundle multiple resource files into one
file. It provides a compiler for that.
Providing such a file directly would not be the best idea, since the
goal of this library is to provide as many javascript libraries as
possible, and maybe you won't use many of them.

Therefore, you have to do to manual steps to get production ready.
You must copy the required javascript files to a specific directory
and override the resource directory colective.requirejs. Then you need
to build your own custom resource bundle. That part has not been
tested yet.

Library adaptions
=================
The provided libraries have been modified minimally.
They have been made proper modules with declared dependencies. Also,
they have been converted to not set any global variables at all, where
possible. That means, you can use the provided jquery-1.6.2 without
modifying the original jquery. It will not be overridden!
Please have a look of your own into the history of the repository for
understand the changes.

License
=======
The integration code is licenced under BSD, the embedded libraries have
their own licences

Todo
====
[ ] Create resource bundles and document how to add them
[ ] Add jqueryui
