# PostCSS For Var Plugin

[PostCSS] plugin that enables `@for` loop syntax in your CSS with var.

## Usage

```js
postcss([ require('postcss-for-var') ])
```

```css
@for --i from 1 to 3 {
    .col-var(--i) { width: var(--i)px; }
}
```

```css
.col-1 {
    width: 1px
}
.col-2 {
    width: 2px
}
.col-3 {
    width: 3px
}
```

This plugin must be set after [postcss-nested] and before [postcss-css-variables]/[postcss-custom-properties].

See PostCSS docs for examples for your environment.
