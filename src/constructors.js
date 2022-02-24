import ExpressionStatement from './components/flow_objects/ExpressionStatement.svelte';
import UtilityCallExpression from './components/flow_objects/UtilityCallExpression.svelte';
import VarCallExpression from './components/flow_objects/VarCallExpression.svelte';
import CallExpression from './components/flow_objects/CallExpression.svelte';
import Identifier from './components/flow_objects/Identifier.svelte';
import MemberExpression from './components/flow_objects/MemberExpression.svelte';
import StringLiteral from './components/flow_objects/StringLiteral.svelte';
import IntegerLiteral from './components/flow_objects/IntegerLiteral.svelte';
import AssignmentExpression from './components/flow_objects/AssignmentExpression.svelte';
import VarIdentifier from './components/flow_objects/VarIdentifier.svelte';

// Constructors to use in <svelte:component> tags, keyed by the 'type' from the AST
const constructors = {
    "ExpressionStatement": ExpressionStatement,
    "UtilityCallExpression": UtilityCallExpression,
    "VarCallExpression": VarCallExpression,
    "CallExpression": CallExpression,
    "Identifier": Identifier,
    "MemberExpression": MemberExpression,
    "StringLiteral": StringLiteral,
    "IntegerLiteral": IntegerLiteral,
    "AssignmentExpression": AssignmentExpression,
    "VarIdentifier": VarIdentifier
};

export default constructors;