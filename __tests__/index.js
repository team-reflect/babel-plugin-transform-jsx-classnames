'use strict'

const c = require('./common')
const assert = require('assert')

describe('base', function () {
  it('should generate the classNames on build time', function () {
    assert.strictEqual(c.getCode('<div />;'), '<div />;')
    assert.strictEqual(c.getCode('<div classNames />;'), '<div classNames />;')
    assert.strictEqual(c.getCode('<div classNames="" />;'), '<div classNames="" />;')
    assert.strictEqual(c.getCode('<div classNames={""} />;'), '<div classNames="" />;')
    assert.strictEqual(c.getCode('<div classNames={null} />;'), '<div classNames={null} />;')
    assert.strictEqual(c.getCode('<div classNames={false} />;'), '<div classNames={false} />;')
    assert.strictEqual(c.getCode('<div classNames="element" />;'), '<div classNames="element" />;')
    assert.strictEqual(c.getCode('<div classNames={12} />;'), '<div classNames="12" />;')
    assert.strictEqual(c.getCode('<div classNames={["element", "foo"]} />;'), '<div classNames="element foo" />;')
    assert.strictEqual(
      c.getCode('<div classNames={["element", "foo", ["bar", { block2: true }]]} />;'),
      '<div classNames="element foo bar block2" />;',
    )
    assert.strictEqual(
      c.getCode('<div classNames={["element", "foo foo", ["bar", { block: true, foo: true }]]} />;'),
      '<div classNames="element foo bar block" />;',
    )
    assert.strictEqual(
      c.getCode('<div classNames={["element", "foo foo", ["bar", { block: true, foo: false }]]} />;'),
      '<div classNames="element bar block" />;',
    )
    assert.strictEqual(
      c.getCode('<div><div classNames={["element", "foo", "foo", ["bar", { block: true, foo: false }]]} /></div>;'),
      '<div><div classNames="element bar block" /></div>;',
    )
    assert.strictEqual(c.getCode('<div classNames={"fb bf", 0, `foo`} />;'), '<div classNames="fb bf foo" />;')
    assert.strictEqual(
      c.getCode('<div classNames={"fb bf", `foo ${"gg"} bar`} />;'),
      '<div classNames="fb bf foo gg bar" />;',
    )
    assert.strictEqual(
      c.getCode('<div classNames={"fb bf", `foo${`${10}`}bar`} />;'),
      '<div classNames="fb bf foo10bar" />;',
    )
    assert.strictEqual(c.getCode('<div classNames={["element"]} />;'), '<div classNames="element" />;')
    assert.strictEqual(c.getCode('<div classNames={true ? "a" : "b"} />;'), '<div classNames={true ? "a" : "b"} />;')
    assert.strictEqual(
      c.getCode('<div classNames={`${true ? "a" : "b"}`} />;'),
      '<div classNames={`${true ? "a" : "b"}`} />;',
    )
    assert.strictEqual(
      c.getCode('<div classNames={true ? "a" : false ? "b" : 12} />;'),
      '<div classNames={true ? "a" : false ? "b" : 12} />;',
    )
    assert.strictEqual(
      c.getCode('<div classNames={"element", { foo: true }, ["bar", "foo"]} />;'),
      '<div classNames="element foo bar" />;',
    )
    assert.strictEqual(
      c.getCode('<div {...{ classNames: ("element", { foo: true }, ["bar", "foo"]) }} />;'),
      '<div {...{}} classNames="element foo bar" />;',
    )
    assert.strictEqual(
      c.getCode('<div {...{ foo: "bar", classNames: ("element", { foo: true }, ["bar", "foo"]) }} />;'),
      '<div {...{ foo: "bar" }} classNames="element foo bar" />;',
    )
    assert.strictEqual(
      c.getCode(
        '<div {...{ foo: "bar", styleNames: ["foo", "bar"], classNames: ("element", { foo: true }, ["bar", "foo"]) }} />;',
      ),
      '<div {...{ foo: "bar" }} classNames="element foo bar" styleNames="foo bar" />;',
    )
    assert.strictEqual(c.getCode('<div classNames={`fb bf`} />;'), '<div classNames={`fb bf`} />;')
    assert.strictEqual(c.getCode('<div classNames={`fb ${"fbf"} bf`} />;'), '<div classNames={`fb ${"fbf"} bf`} />;')
    assert.strictEqual(c.getCode('<div classNames={`fb ${cmod()} bf`} />;'), '<div classNames={`fb ${cmod()} bf`} />;')
    assert.strictEqual(c.getCode('<div classNames={[`foo`]} />;'), '<div classNames="foo" />;')
    assert.strictEqual(c.getCode('<div classNames={[[`foo ${cmod()}`]]} />;'), '<div classNames={`foo ${cmod()}`} />;')
    assert.strictEqual(c.getCode('<div classNames={{ ["foo"]: 1, bar: 1 }} />;'), '<div classNames="foo bar" />;')
  })

  it('should generate the className on run time', function () {
    assert.strictEqual(c.getBody('<div classNames={cbmod()} />;'), '<div classNames={_cx(cbmod())} />;')
    assert.strictEqual(c.getBody('<div classNames={{ cbmod }} />;'), '<div classNames={_cx({ cbmod })} />;')
    assert.strictEqual(
      c.getBody('<div classNames={{ foo: new Date() }} />;'),
      '<div classNames={_cx({ foo: new Date() })} />;',
    )
    assert.strictEqual(
      c.getBody('<div classNames={"element", cbmod()} />;'),
      '<div classNames={_cx("element", cbmod())} />;',
    )
    assert.strictEqual(
      c.getBody('<div classNames={[null, "fb", { foo: cmod(), bar: "bar" }, ["elem"]]} />;'),
      '<div classNames={_cx("fb", { foo: cmod(), bar: 1 }, "elem")} />;',
    )
    assert.strictEqual(
      c.getBody('<div classNames={"fb bf-" + cmod()} />;'),
      '<div classNames={_cx("fb bf-" + cmod())} />;',
    )
    assert.strictEqual(
      c.getBody('<div classNames={["fb", cmod(), { foo: cmod(), bar: "bar" }]} />;'),
      '<div classNames={_cx("fb", cmod(), { foo: cmod(), bar: 1 })} />;',
    )
    assert.strictEqual(
      c.getBody('<div classNames={"foobar", cmod() ? "foo" : "bar"} />;'),
      '<div classNames={_cx("foobar", cmod() ? "foo" : "bar")} />;',
    )
    assert.strictEqual(
      c.getBody('<div classNames={["foo", `fb ${cmod()} bf`]} />;'),
      '<div classNames={_cx("foo", `fb ${cmod()} bf`)} />;',
    )
    assert.strictEqual(
      c.getBody('<div classNames={[null, cbmod(), { foo: true }, ["el1", [["el2"], { bar: false }]]]} />;'),
      '<div classNames={_cx(cbmod(), { foo: 1 }, "el1", "el2", { bar: 0 })} />;',
    )
    assert.strictEqual(
      c.getBody('<div classNames={"fb bf", undefined} />;'),
      '<div classNames={_cx("fb bf", undefined)} />;',
    )
    assert.strictEqual(
      c.getBody('<div classNames={true ? "a" : cbmod()} />;'),
      '<div classNames={_cx(true ? "a" : cbmod())} />;',
    )
    assert.strictEqual(
      c.getBody('<div classNames={cmod() ? "a" : false ? false : null} />;'),
      '<div classNames={_cx(cmod() ? "a" : false ? false : null)} />;',
    )
    assert.strictEqual(
      c.getBody('<div classNames={true ? "a" : cmod() ? false : null} />;'),
      '<div classNames={_cx(true ? "a" : cmod() ? false : null)} />;',
    )
    assert.strictEqual(
      c.getBody('<div classNames={{ ["foo"]: cmod(), bar: 1 }} />;'),
      '<div classNames={_cx({ ["foo"]: cmod(), bar: 1 })} />;',
    )
    assert.strictEqual(
      c.getBody('<div classNames={{ ["10"]: cmod(), bar: 1 }} />;'),
      '<div classNames={_cx({ ["10"]: cmod(), bar: 1 })} />;',
    )
    assert.strictEqual(
      c.getBody('<div classNames={"foobar", { [`foo`]: cmod(), bar: 1 }} />;'),
      '<div classNames={_cx("foobar", { [`foo`]: cmod(), bar: 1 })} />;',
    )
    assert.strictEqual(
      c.getBody('<div classNames={"foobar", { [cmod]: true, bar }} />;'),
      '<div classNames={_cx("foobar", { [cmod]: 1, bar })} />;',
    )
    assert.strictEqual(
      c.getBody('<div classNames={"foobar", { [`foo${cmod()}`]: 1, bar: 1 }} />;'),
      '<div classNames={_cx("foobar", { [`foo${cmod()}`]: 1, bar: 1 })} />;',
    )
    assert.strictEqual(
      c.getBody('<div classNames={"foobar", `${cmod() ? "foo": "bar"}`} />;'),
      '<div classNames={_cx("foobar", `${cmod() ? "foo" : "bar"}`)} />;',
    )
    assert.strictEqual(
      c.getBody('<div classNames={"foo", `${cmod()}`} />;'),
      '<div classNames={_cx("foo", `${cmod()}`)} />;',
    )
    assert.strictEqual(
      c.getBody('<div classNames={"foo", `${{ a: 1 }}`} />;'),
      '<div classNames={_cx("foo", `${{ a: 1 }}`)} />;',
    )
  })
})
