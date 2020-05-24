filename = input("animation name: ")


f = open(filename + ".fbx", "rb")
s = f.read()
f.close()


s = s.replace(b'mixamo.com', bytes(filename, "ascii"))


open(filename + "_upd.fbx", "wb").write(s)
