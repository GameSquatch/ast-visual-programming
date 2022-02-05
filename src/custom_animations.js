import { cubicOut } from 'svelte/easing';

function squish(node, params) {
    const { opacity = 0, start = 0 } = params;

    return {
        delay: params.delay || 0,
        duration: params.duration || 400,
        easing: params.easing || cubicOut,
        css(t, _) {
            const o = t * (1 - opacity) + opacity;
            const s = t * (1 - start) + start;
            return `
                transform: scaleY(${s});
                opacity: ${o};
            `;
        }
    };
}

export { squish };