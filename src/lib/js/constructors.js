import ExpressionStatement from '../../components/flow_objects/ExpressionStatement.svelte';
import UtilityCallExpression from '../../components/flow_objects/UtilityCallExpression.svelte';
import FunctionRefCallExpression from '../../components/flow_objects/FunctionRefCallExpression.svelte';
import Identifier from '../../components/flow_objects/Identifier.svelte';
import StringLiteral from '../../components/flow_objects/StringLiteral.svelte';
import IntegerLiteral from '../../components/flow_objects/IntegerLiteral.svelte';
import AssignmentExpression from '../../components/flow_objects/AssignmentExpression.svelte';
import FunctionRefIdentifier from '../../components/flow_objects/FunctionRefIdentifier.svelte';

// Constructors to use in <svelte:component> tags, keyed by the 'type' from the AST
const constructors = {
    "ExpressionStatement": ExpressionStatement,
    "UtilityCallExpression": UtilityCallExpression,
    "FunctionRefCallExpression": FunctionRefCallExpression,
    "Identifier": Identifier,
    "StringLiteral": StringLiteral,
    "IntegerLiteral": IntegerLiteral,
    "AssignmentExpression": AssignmentExpression,
    "FunctionRefIdentifier": FunctionRefIdentifier
};

export default constructors;