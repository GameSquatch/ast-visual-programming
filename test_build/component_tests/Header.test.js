import { render } from '@testing-library/svelte';

import Header from '../../src/components/Header.svelte';

import { assert } from 'chai';

suite('testing', function() {
    test('it works?', function() {
        const { getByText } = render(Header);

        assert.isNotNull(getByText("Z-Flow"));
    });
});