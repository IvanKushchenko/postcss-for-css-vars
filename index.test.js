const postcss = require('postcss');
const plugin = require('./index.js')

function run (input, output, opts = { }) {
  expect(postcss([plugin(opts)]).process(input).css).toEqual(output);
}

describe('postcss-for-css-vars', () => {

  it('iterates from and to', () => {
    run(
      `@for --i from 1 to 3 { .b-var(--i) { width: var(--i)px; } }`,
      ` .b-1 { width: 1px; }\n.b-2 { width: 2px; }\n.b-3 { width: 3px; }`
    )
  })

  it('iterates from and to in media queries', () => {
    run(
      `@media (max-width: 1200px) { @for --i from 1 to 3 { .b-var(--i) { width: var(--i)px; } } }`,
      `@media (max-width: 1200px) { .b-1 { width: 1px; } .b-2 { width: 2px; } .b-3 { width: 3px; } }`
    )
  })

  it('iterates from and to with multiple rules in loop', () => {
    run(
      `@media (max-width: 1200px) { @for --i from 1 to 2 { .b-var(--i) { width: var(--i)px; } .c-var(--i) { width: var(--i)px; } } }`,
      `@media (max-width: 1200px) { .b-1 { width: 1px; } .b-2 { width: 2px; } .c-1 { width: 1px; } .c-2 { width: 2px; } }`
    )
  })

  it('it throws an error on wrong syntax', () => {
    expect(function () {
      run(
      `@for --i since 1 until 3 { .b-var(--i) { width: var(--i)px; } }`)
    }).toThrow('<css input>:1:1: Wrong loop syntax')
  });

  it('it throws an error on wrong range parameters', function () {
      expect(function () {
        run(
          '@for --i from a to c { .b-var(--i) { width: var(--i)px; } }'
        );
      }).toThrow('<css input>:1:1: Range parameter should be a number');
  });

})
