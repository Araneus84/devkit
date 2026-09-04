const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');const root=path.resolve(__dirname,'..');const samples=[
 'import pandas as pd\ndf = pd.read_csv("sales.csv")\nprint(df)\n',
 'x = 1 # count\nif x > 0:\n    # inside\n    print(x) # show\nelse:\n    print("empty")\n',
 'def run(x, scale=2):\n    for item in range(x):\n        print(item * scale)\n    return x\n',
 '@decorator\ndef run():\n    return 1\n',
 'with open("file.txt") as f:\n    print(f.read())\n',
 'x = [i * 2 for i in range(5)]\nprint(*x, sep=", ")\n',
 'if x:\n    print("a")\nelif y:\n    print("b")\nelse:\n    print("c")\n',
 'def text():\n    value = """first\n    second"""\n    return value\n',
 'from __future__ import annotations\nimport numpy as np\nvalues = np.array([1, 2, 3])\nmean = np.mean(values)\n',
 'import pandas as pd\nimport openpyxl\ndf = pd.read_excel("a.xlsx", sheet_name="Sheet1", engine="openpyxl")\ndf.to_excel("b.xlsx", sheet_name="Results", index=False, engine="openpyxl")\n',
 'import cv2\nimage = cv2.imread("a.png")\nif image is not None:\n    image = cv2.resize(image, (640, 480))\n    saved = cv2.imwrite("b.png", image)\n'
];const c=vm.createContext({console,samples});for(const f of ['vendor/js-yaml.min.js','vendor/lezer-python.js','src/command-definitions.js','src/recipe-catalog.js','src/deep-model.js','src/python-model.js'])vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),c);const result=vm.runInContext('samples.map(source=>({source,generated:pyP.generate(pyParse(source))}))',c);if(process.env.DEVKIT_TEST_OUTPUT){fs.mkdirSync(process.env.DEVKIT_TEST_OUTPUT,{recursive:true});fs.writeFileSync(path.join(process.env.DEVKIT_TEST_OUTPUT,'roundtrip.json'),JSON.stringify(result));}for(const item of result){c.code=item.generated;vm.runInContext('pyParse(code)',c);}console.log('PASS: '+samples.length+' Python round-trip fixtures parsed. Set DEVKIT_TEST_OUTPUT to export them for CPython AST comparison.');
