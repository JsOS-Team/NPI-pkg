module.exports = {
  '/(.*)\n/' (keys, vim, res) {
    vim.searchBuffer = res[1];
    const lastMode = vim.lastMode || 'command';

    vim.mode(lastMode);
    vim.exec('n');
  },
};
