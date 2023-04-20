`@Injectable()` classes are not the traditional classes as such.

They are more like namespaces, or python modules, in the sense that they hold a
bunch of functions together.

They do not contain any business-logic specific state, and their methods are
meant to be stateless pure methods.

The reason for this is they are basically elements in the DI graph. As a
side-effect of that, they also get other such class instances injected to them (
inside constructors or properties).

This is very similar to how Spring's DI system works, and I personally feel
makes it easier to work with larger codebases.

---
