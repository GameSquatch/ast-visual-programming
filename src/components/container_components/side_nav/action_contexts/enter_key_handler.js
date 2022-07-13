/**
 * 
 * @param {KeyboardEvent} event 
 * @param {Function} onEnterKey 
 */
function onEnterKeyHandler(event, onEnterKey) {
    if (event.key === 'Enter') {
        onEnterKey(event);
    }
}

export { onEnterKeyHandler };