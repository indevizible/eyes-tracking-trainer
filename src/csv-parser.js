class Parser {}

Parser.parse = (csv) => {
  let rows = csv.split('\n');
  const legends = rows.shift().split(',');
  return rows.map(r => {
    let _ = {
      input: {},
      output: {}
    };
    r.split(',').forEach((v, i) => {
      const key = i < 2 ? 'output' : 'input';
      _[key][legends[i]] = 1 * v;
    });
    return _;
  });
};

export default Parser;
