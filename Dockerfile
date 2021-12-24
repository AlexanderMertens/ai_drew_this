# This environment uses Python version 3.9
#
# Updated in 20/12/2021
# Author: Alexander Mertens
FROM python:3.9-slim

RUN apt-get -y update && apt-get -y upgrade

# need pip to install modules
RUN apt-get -y install python3-pip

# install python packages
RUN pip3 install pip --upgrade
COPY requirements.txt /requirements.txt
RUN pip install --no-cache-dir -r /requirements.txt

# outputs in real time 
ENV PYTHONUNBUFFERED=1

# copy the code to the container
COPY . /ai-drew-this

# Change the workdir
WORKDIR /ai-drew-this

PORT=8080
EXPOSE $PORT

# Run script
ENTRYPOINT ["bin/run.sh"]