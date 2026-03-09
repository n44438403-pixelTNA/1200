import subprocess
try:
    res = subprocess.run(["npx", "tsc", "--noEmit"], capture_output=True, text=True, check=True)
    print("TypeScript compilation passed!")
except subprocess.CalledProcessError as e:
    print("TypeScript compilation failed:")
    print(e.stdout)
