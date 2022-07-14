# Visual Programming

The currently deployed version (which may or may not be the most recent commit) can be found here: https://z-flow.herokuapp.com/

The idea behind this project is to see if web-based tools, JSON, and Abstract Syntax Trees (AST) could be used to generate backend logic code from a frontend UI tool.

This involves some heavy recursion, but by using this pattern, the implementation almost builds itself in a way. As an example, the code in `code_generator/code_generator.js` only calls the code generator for the root node; the generators then build themselves by calling the code generators for their constituent code generators. This continues until a terminal node within the syntax tree is reached. At which point, the string for the generated code is returned to the generator that called it. In other words, higher level code generators build their code by putting together the strings that lower level generators return.

For a function call (CallExpression) that looks like `doThing("hello")`, the generator would be accomplishing the following:
```
CallExpression() ->
  callee + "(" + arguments + ")"

callee = Identifier() ->
  name // "doThing"

arguments = StringLiteral() ->
  value // "hello"
```

Where `arguments` would build a comma-separated string while looping through each item in the arg list


# Generating Test Code

To test this out, first view the mock data object in the `code_generator.js` file, then run the file running this from the root of the project:
```sh
node code_generator/code_generator.js
```
The code will generate from the source JSON object and output into the terminal. You will see a made up language that has a `StringUtil` class with static string manipulation method `concat`.
