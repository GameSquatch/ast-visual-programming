import { render } from '@testing-library/svelte';

import FlowController from '../../src/components/container_components/FlowController.svelte';

import { assert } from 'chai';

suite('FlowController', function() {
    test('Render mock data json', function() {
        const { getAllByText } = render(FlowController);

        assert.strictEqual(getAllByText("Drag an action here").length, 4, "Flow controller isn't rendering empty expression statements");
    });
});