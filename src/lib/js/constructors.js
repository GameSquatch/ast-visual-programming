import ExpressionStatement from '../../components/flow_objects/ExpressionStatement.svelte';
import UtilityCallExpression from '../../components/flow_objects/UtilityCallExpression.svelte';
import VariableRefCallExpression from '../../components/flow_objects/VariableRefCallExpression.svelte';
import Identifier from '../../components/flow_objects/Identifier.svelte';
import StringLiteral from '../../components/flow_objects/StringLiteral.svelte';
import IntegerLiteral from '../../components/flow_objects/IntegerLiteral.svelte';
import AssignmentExpression from '../../components/flow_objects/AssignmentExpression.svelte';
import VariableRefIdentifier from '../../components/flow_objects/VariableRefIdentifier.svelte';
import FunctionCallExpression from '../../components/flow_objects/FunctionCallExpression.svelte';

// Constructors to use in <svelte:component> tags, keyed by the 'type' from the AST
const constructors = {
    "ExpressionStatement": ExpressionStatement,
    "UtilityCallExpression": UtilityCallExpression,
    "VariableRefCallExpression": VariableRefCallExpression,
    "Identifier": Identifier,
    "StringLiteral": StringLiteral,
    "IntegerLiteral": IntegerLiteral,
    "AssignmentExpression": AssignmentExpression,
    "VariableRefIdentifier": VariableRefIdentifier,
    "FunctionCallExpression": FunctionCallExpression
};

export default constructors;