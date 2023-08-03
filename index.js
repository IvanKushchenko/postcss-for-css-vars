const checkNumber = function (rule) {
    return function (param) {
        if (isNaN(parseInt(param))) {
            if (param.indexOf('--') !== -1) {
                if( !parentsHaveIterator(rule, param) ) {
                    throw rule.error('External variable (not from a parent for loop) cannot be used as a range parameter', { plugin: 'postcss-for-css-vars' });
                }
            } else {
                throw rule.error('Range parameter should be a number', { plugin: 'postcss-for-css-vars' });
            }
        }
    };
};

const checkParams = function (rule, params) {

    if (!params[0].match(/\-\-([\w\d-_]+)/) ||
         params[1] !== 'from' ||
         params[3] !== 'to' ) {
        throw rule.error('Wrong loop syntax', { plugin: 'postcss-for-css-vars' });
    }

    [params[2], params[4]].forEach(checkNumber(rule));
};

const loop = function(nodes, root) {
  nodes.forEach((rule, index) => {

    if(rule.nodes.length && rule.type === "atrule" && rule.name !== "for") return loop(rule.nodes, root);

    const params = rule.params.split(/\s/);

    checkParams(rule, params);

    const variable = params[0];
    const from = params[2];
    const to = params[4];

    for ( let i = from; i <= to; i++ ) {
      const content = rule.clone();
      content.nodes[0].nodes.forEach(node => {
        node.value = node.value.replace(`var(${variable})`, i);
        node.parent.selector = node.parent.selector.replace(`var(${variable})`, i);
      })

      rule.parent.insertBefore(rule, content.nodes[0]);
    }

    if(rule.parent) rule.remove();
  })
}

module.exports = () => {
  return {
    postcssPlugin: 'postcss-for-css-vars',
    prepare () {
      return {
        Once(root) {
          const nodes = [...root.nodes];
          loop(nodes, root);
        }
      }
    }
  }
}
module.exports.postcss = true;
