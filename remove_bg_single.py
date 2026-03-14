import sys
import ssl
import urllib.request
from io import BytesIO
from rembg import remove, new_session
from PIL import Image

ssl._create_default_https_context = ssl._create_unverified_context

url = "https://images.unsplash.com/photo-1614200179396-2bdb77ebf81b?q=80&w=2670&auto=format&fit=crop"
print("Downloading image...")
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
response = urllib.request.urlopen(req).read()
input_image = Image.open(BytesIO(response))

print("Removing background...")
session = new_session("u2net")
output_image = remove(input_image, session=session)

output_image.save("public/images/about-car-transparent.png")
print("Done!")
