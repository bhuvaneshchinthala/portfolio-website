import json

with open('package.json', 'r') as f:
    data = json.load(f)

deps = data.get('dependencies', {})
new_deps = {k: v for k, v in deps.items() if not k.startswith('@wix')}
data['dependencies'] = new_deps

with open('package.json', 'w') as f:
    json.dump(data, f, indent=2)

print("Removed @wix dependencies")
