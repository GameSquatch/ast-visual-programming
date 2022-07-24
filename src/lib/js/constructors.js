import ExpressionStatement from '../../components/flow_objects/ExpressionStatement.svelte';
import UtilityCallExpression from '../../components/flow_objects/UtilityCallExpression.svelte';
import IdentifierRefCallExpression from '../../components/flow_objects/IdentifierRefCallExpression.svelte';
import Identifier from '../../components/flow_objects/Identifier.svelte';
import StringLiteral from '../../components/flow_objects/StringLiteral.svelte';
import IntegerLiteral from '../../components/flow_objects/IntegerLiteral.svelte';
import AssignmentExpression from '../../components/flow_objects/AssignmentExpression.svelte';
import RefIdentifier from '../../components/flow_objects/RefIdentifier.svelte';
import FunctionCallExpression from '../../components/flow_objects/FunctionCallExpression.svelte';

// Constructors to use in <svelte:component> tags, keyed by the 'type' from the AST
const constructors = {
    "ExpressionStatement": ExpressionStatement,
    "UtilityCallExpression": UtilityCallExpression,
    "IdentifierRefCallExpression": IdentifierRefCallExpression,
    "Identifier": Identifier,
    "StringLiteral": StringLiteral,
    "IntegerLiteral": IntegerLiteral,
    "AssignmentExpression": AssignmentExpression,
    "RefIdentifier": RefIdentifier,
    "FunctionCallExpression": FunctionCallExpression
};

export default constructors;