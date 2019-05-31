import zipfile
import os
import sys

def useFile(base, file):
    nozipfiles = ['.git', 'john-proctor-api.zip', 'zip.py']
    for nozipfile in nozipfiles:
        if nozipfile in file:
                return False
        if nozipfile in base:
                return False
    return True

def zipfolder(foldername, target_dir):         
    zipobj = zipfile.ZipFile(foldername + '.zip', 'w', zipfile.ZIP_DEFLATED)
    rootlen = len(target_dir) + 1
    for base, dirs, files in os.walk(target_dir):
        for file in files:
            if useFile(base, file):
                fn = os.path.join(base, file)
                zipobj.write(fn, fn[rootlen:])

print('Starting to zip john_proctor_api.zip')
zipfolder('john-proctor-api', os.getcwd())
print('...')
print('Finished zipping john_proctor_api.zip')

sys.exit()