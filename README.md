# Visual Programming

The idea behind this project is to see if web-based tools, JSON, and Abstract Syntax Trees (AST) could be used to generate backend logic code.

This involves some heavy recursion, but by using this pattern, the implementation almost takes care of its self in a way. As an example, the code in `code_generator/code_generator.js` only calls the code generator for the root node, and the generators then build themselves from their inner components. To take the example further, an `Expression` might be made up of a `Call Expression` (function call), which has a callee and arguments. The callee might be a `Member Expression` or an `Identifier`. The arguments may be `String Literals`. These pieces at the very end are called "terminal nodes" in the tree.

To test this out, first view the mock data object in the `code_generator.js` file, then run the file using `node code_generator/code_generator.js` from the root of the project. You will see a made up language that has a `StringUtil` class with static string manipulation method `concat`.
