import _traverse from "@babel/traverse";

// babel的模块兼容性问题，详见https://github.com/babel/babel/issues/13855
// @ts-ignore
const traverse: typeof _traverse = _traverse.default;

export default traverse;