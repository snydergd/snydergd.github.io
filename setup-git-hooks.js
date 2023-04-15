const fs = require("fs");
const path = require("path");

const hooks = ["pre-commit"];

for (let i = 0; i < hooks.length; i++) {
  const hook = hooks[i];
  const source = path.join(__dirname, hook + ".sh");
  const destination = path.join(__dirname, ".git", "hooks", hook);
  
  fs.writeFileSync(destination, `#!/bin/bash\nbash ${source}`);
  fs.chmodSync(destination, '755');
}

