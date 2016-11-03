import os
from urllib.request import urlopen
import subprocess

def main():
	cwd = os.path.dirname(os.path.realpath(__file__))
	imglist = cwd + "/images.txt"
	outpic = cwd + "/downloadpic.jpg"

	myimglist = open(imglist, 'r')
	
	#subprocess.run(["wget", "-i", imglist])
	#download_dest = cwd + "/images"
	
	for line in myimglist:
		    # try:
		    # 	pic = urlparse(line)
		    # except timeout:
		    # 	print("timeout error dawg"cd )
		    # 	pass
            
	    #resource = urllib.urlopen(line)
	    url = urlopen(str(line))
	    try:
	    	out = open(outpic, "wb")
	    	out.write(url.read())
	    	print("got eem")
	    except:
	    	print("something goofed")
	    subprocess.run(["docker", "run", "--volume=$(pwd):/workspace", "caffe:cpu", "python", "./classify_nsfw.py", "--model_def", "nsfw_model/deploy.prototxt", "--pretrained_model", "nsfw_model/resnet_50_1by2_nsfw.caffemodel", "downloadpic.jpg"])
	    out.close()
main()