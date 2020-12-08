# babel-plugin-transform-jsx-classnames

[![Build Status](https://travis-ci.org/gtournie/babel-plugin-transform-jsx-classnames.svg?branch=master)](https://travis-ci.org/gtournie/babel-plugin-transform-jsx-classnames)
[![Coverage Status](https://coveralls.io/repos/github/gtournie/babel-plugin-transform-jsx-classnames/badge.svg?branch=master)](https://coveralls.io/github/gtournie/babel-plugin-transform-jsx-classnames?branch=master)
[![npm downloads](https://img.shields.io/npm/dm/babel-plugin-transform-jsx-classnames.svg?style=flat-square)](https://www.npmjs.com/package/babel-plugin-transform-jsx-classnames)

className and styleName on steroids 💪

## Usage

Allow you to write jsx classNamess in a simpler way, without having to worry about importing a helper (like [classnames](https://www.npmjs.com/package/classnames)). `classNames` or `styleNames` attributes take any number of arguments which can be a string, an array or an object (if the value associated with a given key is falsy, that key won't be included in the output). [See examples](#examples)

## Install

When babel-plugin-transform-jsx-classnames cannot resolve `classNames` / `styleNames` during compilation, it imports a helper function (read [build time resolution](#build-time-resolution)). Therefore, you must install babel-plugin-react-css-modules as a direct dependency of the project.

```bash
$ npm install babel-plugin-transform-jsx-classnames --save
```

Add to `.babelrc`:

```js
{
  plugins: ['transform-jsx-classnames']
}
```

> Note: ⚠️ If you're using `babel-plugin-react-css-modules`, ensure you're adding `transform-jsx-classnames` **before**

## Build time resolution

The plugin will try to resolve the `classNames` / `styleNames` during the compilation (`classNames={"foo", { active: true }}`) and fallback to runtime if not possible (`classNames={_cx("foo", { active: props.active })}` - a tiny helper (~0.3Ko) will be included automatically.

## Runtime helper

The runtime helper is very similar to the [classnames](https://www.npmjs.com/package/classnames) package. It actually behaves like its [dedupe](https://www.npmjs.com/package/classnames#alternate-dedupe-version) version.

The only difference you'll find will be with full numeric classNamess: output will always spit numbers first (ex: `classNames={"a", 12}` => `classNames="12 a"`). It shouldn't be a big deal though, as using numeric values for classNamess is pretty rare and order only matters in a very few specific cases.

## Performance & dedupe

Dedupe has been optimized a lot and its performance is very similar to [classnames](https://www.npmjs.com/package/classnames) (in no dedupe mode). It's even better in some cases.

## Examples

### Build time

```html
<div classNames={"foo", "bar"}>
→ <div classNames="foo bar"></div>

<div classNames={'foo', { bar: true }}>
→ <div classNames="foo bar"></div>

<div classNames={{ 'foo-bar': true }}>
→ <div classNames="foo-bar"></div>

<div classNames={{ 'foo-bar': false }}>
→ <div classNames=""></div>

<div classNames={{ foo: true }, { bar: true }, ["foobar", "duck"]}>
→ <div classNames="foo bar foobar duck"></div>

<div classNames={'foo', { bar: true, duck: false }, 'baz', { quux: true }}>
→ <div classNames="foo bar baz quux"></div>

<!-- styleNames -->
<div styleNames={"foo", "bar"}>
→ <div styleNames="foo bar"></div>

<!-- Dedupe -->
<div classNames={'foo foo', 'bar', { bar: true, foo: false }}>
→ <div classNames="bar"></div>

<!-- No change -->
<div classNames={props.active ? "foo" : "bar"}>
→ <div classNames={props.active ? "foo" : "bar"}></div>
```

### Runtime

When `classNames` / `styleNames` can't be resolved at compilation.

```js
<div classNames={"foo", { active: props.active }}>
→ <div classNames={_cx("foo", { active: props.active })}></div>

<div classNames={{ foo: true, [`btn-${props.type}`]: true }}>
→ <div classNames={_cx({ foo: true, [`btn-${props.type}`]: true })}></div>

<div classNames={"foo", props.active && getClassName()}>
→ <div classNames={_cx("foo", props.active && getClassName())}></div>
```

## Send some love

You like this package?

[![Buy me a coffee](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/jCk0aHycU)
