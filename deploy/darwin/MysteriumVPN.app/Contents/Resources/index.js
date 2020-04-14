const path = require("path");
// Fix so that macos resources are found correctly
// since webpack will bundle them such that the expected path is /dist from cwd
process.chdir(path.resolve(path.dirname(process.execPath), "..", "Resources"));
// Now start loading the actual bundle
require("./dist");
