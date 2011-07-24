from Products.Five.browser import BrowserView

class Config(BrowserView):
    def __call__(self):
        return "require = {'baseUrl' : '%s'};" % (self.context.absolute_url()\
            + "/++resource++collective.requirejs/")
